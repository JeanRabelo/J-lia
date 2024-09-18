window.onload = function() {
    setTimeout(() => {
        document.body.classList.add('fade-pqrs');
        setTimeout(() => {
            document.body.classList.add('move-o');
            setTimeout(() => {
	        setTimeout(() => {
                document.body.classList.add('zoom-active');
		}, 1000);
                setTimeout(() => {
                    document.body.classList.add('show-content');
                }, 2000);
            }, 1000);
        }, 1000);
    }, 2000);
};
