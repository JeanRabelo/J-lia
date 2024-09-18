window.onload = function() {
    const typedText = "QÓculos";
    const typedContainer = document.getElementById("typed-text");
    const cursor = document.querySelector(".blinking-cursor");
    
    let currentIndex = 0;
    
    // Function to type out each character
    function typeNextChar() {
        if (currentIndex < typedText.length) {
            typedContainer.innerHTML += typedText[currentIndex];
            currentIndex++;
            setTimeout(typeNextChar, 200); // Adjust speed of typing
        } else {
            // Remove the cursor after typing is done
            cursor.style.display = 'none';

            // Show the original static QÓculos and start animations
            document.querySelector(".opqrs-container").style.display = "flex";
            
            // Remove the typed animation container
            setTimeout(() => {
                document.querySelector(".typing-container").remove();
                startAnimations();
            }, 500); // Give it some time before starting animations
        }
    }
    
    // Start typing after a brief delay
    setTimeout(() => {
        typeNextChar();
    }, 1000);

    // Function to start the existing animations after typing
    function startAnimations() {
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
    }
};

