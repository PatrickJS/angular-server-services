import bootstrap from './bootstrap.browser';

// Dom ready
requestAnimationFrame(function ready () {
	return document.body ? bootstrap() : requestAnimationFrame(ready);
});
