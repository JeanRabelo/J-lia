window.onload = function() {
    setTimeout(() => {
        // Step 1: Fade out 'pqrs' after 2 seconds
        document.body.classList.add('fade-pqrs');

        setTimeout(() => {
            // Step 2: Move the 'O' to the center (this is the same 'O' from 'Opqrs')
            document.body.classList.add('show-o');

            setTimeout(() => {
                // Step 3: Activate the zoom effect on 'O' and show "Hello World"
                document.body.classList.add('zoom-active');
                setTimeout(() => {
                    document.querySelector('.hello-world').style.display = 'block'; // Show "Hello World"
                }, 2000); // Delay showing "Hello World" until the zoom is done
            }, 1000); // Delay before starting the zoom effect
        }, 1000); // Delay after fading out 'pqrs'
    }, 2000); // Initial delay before fading out 'pqrs'
};

