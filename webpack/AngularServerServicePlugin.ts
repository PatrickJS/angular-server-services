import * as prettier from 'prettier';
import { parse, ParserOptions } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';
import * as fs from 'fs';
import * as path from 'path';

function getFilesInDirectory(directory: string, extension: string): string[] {
  let files: string[] = [];

  const items = fs.readdirSync(directory);
  for (const item of items) {
    const fullPath = path.join(directory, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files = files.concat(getFilesInDirectory(fullPath, extension));
    } else if (path.extname(item) === extension) {
      files.push(fullPath);
    }
  }

  return files;
}


interface Compiler {
  inputFileSystem: any;
  outputFileSystem: any;
  context: string;
  hooks: {
    beforeCompile: {
      tapAsync: (name: string, callback: (params: unknown, cb: () => void) => void) => void;
    };
  };
}

export class AngularServerServicePlugin {
  once = false;
  constructor(private options: { target: 'server' | 'browser', serverConfig: string, serverComponents: string[] }) {}
  apply(compiler: Compiler) {
    if (this.once) {
      return;
    }
    compiler.hooks.beforeCompile.tapAsync('WebpackPlugin', (params, callback) => {
      if (this.once) {
        return;
      }
      const serverComponents = this.options.serverComponents;
      const parserOptions: ParserOptions = {
        sourceType: 'module',
        plugins: ['typescript', 'decorators-legacy'],
      };
      this.generateClientComponent(serverComponents, compiler, parserOptions);
      this.replaceServerWithClientImports(
        path.resolve(compiler.context, './src/app'),
        compiler,
        parserOptions
      );
      this.generateServerConfig(serverComponents, compiler, parserOptions);


      this.once = true;
      callback();
    });
  }
  
  generateServerConfig(serverComponents: string[], compiler: Compiler, parserOptions: ParserOptions) {
    const filePath = path.resolve(compiler.context, this.options.serverConfig);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const ast = parse(fileContent, parserOptions);
    // console.log('ast', ast);

    traverse(ast, {
      Program(path: NodePath<t.Program>) {
        const newImportStatements = [
          "import { ReflectiveInjector } from 'injection-js';",
          "import { ExampleService } from '@client/ExampleService';",
          "import { ExampleService as ExampleServiceServer } from '@server/ExampleService';",
        ].map((statement) => {
          const ast = parse(statement, parserOptions);
          // console.log('ast', ast);
          return ast.program.body[0] as t.ImportDeclaration;
        });

        path.node.body.unshift(...newImportStatements);

        const newVariableStatements = [
          `export const injector = ReflectiveInjector.resolveAndCreate([
            { provide: ExampleServiceServer, useClass: ExampleServiceServer },
            { provide: ExampleService, useExisting: ExampleServiceServer },
            { provide: 'ExampleService', useExisting: ExampleServiceServer }
          ]);`,
        ].map((statement) => {
          const ast = parse(statement, parserOptions);
          // console.log('ast', ast);
          return ast.program.body[0] as t.ExportNamedDeclaration;
        });

        path.node.body.push(...newVariableStatements);
      },

      VariableDeclaration(path: NodePath<t.VariableDeclaration>) {
        if (
          t.isIdentifier(path.node.declarations[0].id) &&
          path.node.declarations[0].id.name === 'serverConfig' &&
          t.isObjectExpression(path.node.declarations[0].init!)
        ) {
          const providersProperty = path.node.declarations[0].init!.properties.find(
            (property): property is t.ObjectProperty =>
              t.isObjectProperty(property) &&
              t.isIdentifier(property.key) &&
              property.key.name === 'providers'
          );
      
          if (
            providersProperty &&
            t.isArrayExpression(providersProperty.value)
          ) {
            // Iterate over each component in the serverComponents array
            for (const Service of serverComponents) {
              // Generate the provider string and parse it
              const provider = `{ provide: ${Service}, useFactory: () => injector.get(${Service}) }`;
              const newProvider = parse(
                `(${ provider })`,
                parserOptions
              ).program.body[0] as t.ExpressionStatement;
              // Add the generated provider to the providers array in the AST
              providersProperty.value.elements.push(newProvider.expression as t.ObjectExpression);
            }
          }
        }
      },
    });        

    const output = generate(ast, {}, fileContent);
    const formattedOutput = prettier.format(output.code, { semi: false, parser: "babel" });
    // fs.writeFileSync(filePath, formattedOutput, 'utf-8');
    // const fileContent = compiler.inputFileSystem.readFileSync(filePath, 'utf-8');
    compiler.outputFileSystem.writeFileSync(filePath, formattedOutput, 'utf-8');

  }
  replaceServerWithClientImports(
    appFolderPath: string,
    compiler: Compiler,
    parserOptions: ParserOptions
  ) {
    // Get all .ts files in the app folder and subfolders
    const files = getFilesInDirectory(appFolderPath, '.ts');
  
    files.forEach((file) => {
      const fileContent = fs.readFileSync(file, 'utf-8');
  
      // Only edit files with @server and not .server files
      if (!fileContent.includes('@server') || file.includes('.server')) {
        return;
      }
  
      const ast = parse(fileContent, parserOptions);
  
      traverse(ast, {
        ImportDeclaration(path: NodePath<t.ImportDeclaration>) {
          if (t.isStringLiteral(path.node.source) && path.node.source.value.startsWith('@server/')) {
            // Replace '@server' with '@client'
            path.node.source.value = path.node.source.value.replace('@server', '@client');
          }
        },
      });
  
      const output = generate(ast, {}, fileContent);
      // fs.writeFileSync(file, output.code, 'utf-8');
      compiler.outputFileSystem.writeFileSync(file, output.code, 'utf-8');
    });
  }

  generateClientComponent(serverComponents: string[], compiler: Compiler, parserOptions: ParserOptions) {
    const serverServicePath = path.resolve(compiler.context, './src/@server/ExampleService.ts');
    const clientServicePath = path.resolve(compiler.context, './src/@client/ExampleService.ts');

    const serverServiceContent = fs.readFileSync(serverServicePath, 'utf-8');
    const ast = parse(serverServiceContent, parserOptions);

    traverse(ast, {
      ClassDeclaration(path: NodePath<t.ClassDeclaration>) {
        const injectableImport = parse(
          "import { Injectable } from '@angular/core';", 
          parserOptions
        ).program.body[0] as t.ImportDeclaration;
        
        const injectableDecorator = t.decorator(
          t.callExpression(
            t.identifier("Injectable"),
            [t.objectExpression([t.objectProperty(t.identifier("providedIn"), t.stringLiteral("root"))])]
          )
        );
        
        
        path.node.decorators = [injectableDecorator];
        
        path.node.body.body = path.node.body.body.map((methodDefinition) => {
          if (t.isClassMethod(methodDefinition)) {
            methodDefinition.body.body = [];
          }
          return methodDefinition;
        });

        ast.program.body.unshift(injectableImport);
      }
    });

    const output = generate(ast, {}, serverServiceContent);
    const formattedOutput = prettier.format(output.code, { semi: false, parser: "babel" });
    // fs.writeFileSync(clientServicePath, formattedOutput, 'utf-8');
    compiler.outputFileSystem.writeFileSync(clientServicePath, formattedOutput, 'utf-8');
  }
}