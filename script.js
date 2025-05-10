document.addEventListener('DOMContentLoaded', async function() {
    // Check Supabase connection
    let supabaseConnected = false;
    if (typeof testSupabaseConnection === 'function') {
        supabaseConnected = await testSupabaseConnection();
    }
    
    if (!supabaseConnected) {
        console.warn('Supabase connection failed. Using local storage fallback.');
    } else {
        console.log('Supabase connection successful.');
    }
    
    // DOM elements
    const card = document.querySelector('.card');
    const themeSelect = document.getElementById('theme');
    const applyBtn = document.getElementById('apply-btn');
    const shareBtn = document.getElementById('share-btn');
    const recipientInput = document.getElementById('recipient');
    const messageInput = document.getElementById('message');
    const personalMessageDiv = document.getElementById('personal-message-display');
    const recipientDisplay = document.getElementById('recipient-display');
    const messageDisplay = document.getElementById('message-display');
    
    // Add click event to flip card
    card.addEventListener('click', function() {
        this.classList.toggle('flipped');
    });
    
    // Apply button event
    applyBtn.addEventListener('click', function() {
        // Set theme
        document.body.className = '';
        if (themeSelect.value) {
            document.body.classList.add(`${themeSelect.value}-theme`);
        }
        
        // Update personal message
        const recipient = recipientInput.value.trim();
        const message = messageInput.value.trim();
        const senderName = document.getElementById('sender-name').value.trim();
        
        if (recipient || message) {
            personalMessageDiv.style.display = 'block';
            recipientDisplay.textContent = recipient || 'Friend';
            messageDisplay.textContent = message || 'Wishing you peace and joy on this Vesak Day.';
            document.getElementById('sender-display').textContent = senderName || 'You';
        }
        
        // Add a small animation to show changes were applied
        personalMessageDiv.classList.add('highlight');
        setTimeout(() => {
            personalMessageDiv.classList.remove('highlight');
        }, 1000);
        
        // Save card data
        saveCardData();
    });
    
    // Share button event - Enhanced to show share options
    shareBtn.addEventListener('click', function() {
        showShareOptions();
    });
    
    // Add particle effects (floating lotus petals)
    createParticles();
    
    // Load saved card data and check for shared cards
    loadCardData();
    checkForSharedCard();
    
    // Add html2canvas script for image download
    loadHtml2Canvas();
});

// Function to create floating lotus petal particles
function createParticles() {
    const container = document.querySelector('.container');
    const numParticles = 15;
    
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 20 + 10}px;
            height: ${Math.random() * 30 + 15}px;
            background-color: rgba(255, 255, 255, 0.7);
            border-radius: 50% 50% 0 0;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            transform: rotate(${Math.random() * 360}deg);
            animation: float ${Math.random() * 15 + 10}s linear infinite;
            opacity: ${Math.random() * 0.5 + 0.3};
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
            z-index: ${Math.floor(Math.random() * 5)};
        `;
        
        // Add animation keyframes dynamically
        const startX = Math.random() * 100;
        const endX = Math.random() * 100;
        
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes float {
                0% {
                    transform: translate(${startX}vw, -50px) rotate(${Math.random() * 360}deg);
                }
                100% {
                    transform: translate(${endX}vw, 100vh) rotate(${Math.random() * 360}deg);
                }
            }
        `;
        
        document.head.appendChild(style);
        container.appendChild(particle);
    }
}

// Function to show share options
function showShareOptions() {
    // Create modal if it doesn't exist yet
    if (!document.getElementById('share-modal')) {
        createShareModal();
    }
    
    // Update share link
    updateShareLink();
    
    // Show the modal
    const modal = document.getElementById('share-modal');
    modal.style.display = 'flex';
}

// Function to create share modal
function createShareModal() {
    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'share-modal';
    modal.className = 'modal';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Create close button
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };
    
    // Create modal header
    const header = document.createElement('h3');
    header.textContent = 'Share Your Vesak Card';
    
    // Create shareable link section
    const linkSection = document.createElement('div');
    linkSection.className = 'link-section';
    
    const linkLabel = document.createElement('p');
    linkLabel.textContent = 'Copy this link to share your card:';
    
    const linkContainer = document.createElement('div');
    linkContainer.className = 'link-container';
    
    const linkInput = document.createElement('input');
    linkInput.type = 'text';
    linkInput.id = 'share-link';
    linkInput.readOnly = true;
    
    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy';
    copyBtn.onclick = function() {
        linkInput.select();
        document.execCommand('copy');
        this.textContent = 'Copied!';
        setTimeout(() => {
            this.textContent = 'Copy';
        }, 2000);
    };
    
    linkContainer.appendChild(linkInput);
    linkContainer.appendChild(copyBtn);
    
    linkSection.appendChild(linkLabel);
    linkSection.appendChild(linkContainer);
    
    // Create social sharing section
    const socialSection = document.createElement('div');
    socialSection.className = 'social-section';
    
    const socialLabel = document.createElement('p');
    socialLabel.textContent = 'Share on social media:';
    
    const socialButtons = document.createElement('div');
    socialButtons.className = 'social-buttons';
    
    // WhatsApp button
    const whatsappBtn = document.createElement('button');
    whatsappBtn.className = 'social-btn whatsapp';
    whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    whatsappBtn.title = 'Share on WhatsApp';
    whatsappBtn.onclick = function() {
        const text = 'Check out my Vesak card!';
        const url = document.getElementById('share-link').value;
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    };
    
    // Facebook button
    const facebookBtn = document.createElement('button');
    facebookBtn.className = 'social-btn facebook';
    facebookBtn.innerHTML = '<i class="fab fa-facebook-f"></i>';
    facebookBtn.title = 'Share on Facebook';
    facebookBtn.onclick = function() {
        const url = document.getElementById('share-link').value;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    };
    
    // Twitter button
    const twitterBtn = document.createElement('button');
    twitterBtn.className = 'social-btn twitter';
    twitterBtn.innerHTML = '<i class="fab fa-twitter"></i>';
    twitterBtn.title = 'Share on Twitter';
    twitterBtn.onclick = function() {
        const text = 'Check out my Vesak card!';
        const url = document.getElementById('share-link').value;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    };
    
    // Email button
    const emailBtn = document.createElement('button');
    emailBtn.className = 'social-btn email';
    emailBtn.innerHTML = '<i class="fas fa-envelope"></i>';
    emailBtn.title = 'Share via Email';
    emailBtn.onclick = function() {
        const subject = 'Check out my Vesak card!';
        const body = 'I created a digital Vesak card for you: ' + document.getElementById('share-link').value;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };
    
    socialButtons.appendChild(whatsappBtn);
    socialButtons.appendChild(facebookBtn);
    socialButtons.appendChild(twitterBtn);
    socialButtons.appendChild(emailBtn);
    
    socialSection.appendChild(socialLabel);
    socialSection.appendChild(socialButtons);
    
    // Create download section
    const downloadSection = document.createElement('div');
    downloadSection.className = 'download-section';
    
    const downloadLabel = document.createElement('p');
    downloadLabel.textContent = 'Download options:';
    
    // Animation download button
    const downloadAnimationBtn = document.createElement('button');
    downloadAnimationBtn.className = 'download-btn animation-btn';
    downloadAnimationBtn.innerHTML = '<i class="fas fa-play-circle"></i> Download Animation';
    downloadAnimationBtn.onclick = createCardVideo;
    
    downloadSection.appendChild(downloadLabel);
    downloadSection.appendChild(downloadAnimationBtn);
    
    // Assemble modal
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(header);
    modalContent.appendChild(linkSection);
    modalContent.appendChild(socialSection);
    modalContent.appendChild(downloadSection);
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Add modal styles
    addModalStyles();
    
    // Close when clicking outside
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

// Function to add modal styles
function addModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            justify-content: center;
            align-items: center;
        }
        
        .modal-content {
            background-color: #fff;
            padding: 25px;
            border-radius: 15px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            position: relative;
        }
        
        .close {
            position: absolute;
            top: 15px;
            right: 20px;
            font-size: 28px;
            font-weight: bold;
            color: #555;
            cursor: pointer;
        }
        
        .close:hover {
            color: #000;
        }
        
        .link-section, .social-section, .download-section {
            margin: 20px 0;
        }
        
        .link-container {
            display: flex;
            margin-top: 10px;
        }
        
        #share-link {
            flex-grow: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px 0 0 5px;
            font-size: 14px;
        }
        
        .link-container button {
            padding: 10px 15px;
            background-color: var(--primary-color);
            border-radius: 0 5px 5px 0;
            margin: 0;
        }
        
        .social-buttons {
            display: flex;
            justify-content: center;
            margin-top: 15px;
            gap: 15px;
        }
        
        .social-btn {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 20px;
            cursor: pointer;
            transition: transform 0.3s;
            border: none;
        }
        
        .social-btn:hover {
            transform: scale(1.1);
        }
        
        .whatsapp {
            background-color: #25D366;
        }
        
        .facebook {
            background-color: #3b5998;
        }
        
        .twitter {
            background-color: #1DA1F2;
        }
        
        .email {
            background-color: #D44638;
        }
        
        .download-buttons {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 10px;
        }
        
        .download-btn {
            width: 100%;
            padding: 15px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            font-size: 16px;
            background-color: #8e44ad;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            font-weight: bold;
            margin-top: 10px;
        }
        
        .download-btn:hover {
            background-color: #9b59b6;
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        }
        
        .animation-btn {
            background: linear-gradient(135deg, #8e44ad, #3498db);
        }
        
        .animation-btn:hover {
            background: linear-gradient(135deg, #9b59b6, #2980b9);
        }
        
        .recording-indicator {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1000;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            font-weight: bold;
        }
        
        .recording-dot {
            width: 15px;
            height: 15px;
            background-color: #e74c3c;
            border-radius: 50%;
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    `;
    document.head.appendChild(style);
}

// Function to update share link
function updateShareLink() {
    const linkInput = document.getElementById('share-link');
    if (!linkInput) return;
    
    // Get or create card ID
    let cardId = localStorage.getItem('vesakCardId');
    if (!cardId) {
        cardId = generateUniqueId();
        localStorage.setItem('vesakCardId', cardId);
    }
    
    // Create shareable link with card ID as parameter
    const baseUrl = window.location.href.split('?')[0];
    const shareUrl = `${baseUrl}?card=${cardId}`;
    
    linkInput.value = shareUrl;
}

// Function to generate unique ID
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Function to save card data to localStorage and Supabase
async function saveCardData() {
    const cardData = {
        recipient: document.getElementById('recipient').value,
        message: document.getElementById('message').value,
        theme: document.getElementById('theme').value,
        sender: document.getElementById('sender-name') ? document.getElementById('sender-name').value : 'You'
    };
    
    // Save card data to localStorage
    localStorage.setItem('vesakCardData', JSON.stringify(cardData));
    
    // Generate unique ID if not exists
    if (!localStorage.getItem('vesakCardId')) {
        const uniqueId = generateUniqueId();
        localStorage.setItem('vesakCardId', uniqueId);
    }
    
    const cardId = localStorage.getItem('vesakCardId');
    
    try {
        // Check if Supabase client is available and properly initialized
        if (typeof supabase !== 'undefined' && supabase && typeof supabase.from === 'function') {
            // Show saving indicator
            const saveStatus = document.getElementById('save-status');
            if (saveStatus) {
                saveStatus.innerHTML = '<p>Saving card to database...</p>';
                saveStatus.style.color = '#8e44ad';
                saveStatus.style.display = 'block';
            }
            
            // Save card data to Supabase
            const { data, error } = await supabase
                .from('vesak_cards')
                .upsert({
                    card_id: cardId,
                    recipient: cardData.recipient,
                    message: cardData.message,
                    theme: cardData.theme,
                    sender: cardData.sender,
                    created_at: new Date()
                })
                .select();
                
            if (error) {
                console.error('Error saving card to Supabase:', error);
                // Show error message
                if (saveStatus) {
                    saveStatus.innerHTML = `<p style="color: red;">Error saving card: ${error.message}</p>`;
                }
                // Also save to sessionStorage as fallback
                sessionStorage.setItem(`card_${cardId}`, JSON.stringify(cardData));
            } else {
                console.log('Card saved to Supabase successfully:', data);
                // Show success message and share link
                if (saveStatus) {
                    const shareLink = window.location.origin + window.location.pathname + '?card=' + cardId;
                    saveStatus.innerHTML = `
                        <p>Card saved successfully! Share the link below:</p>
                        <input type="text" id="share-link-input" value="${shareLink}" readonly 
                            style="width: 100%; margin: 5px 0; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" 
                            onclick="this.select()">
                        <button onclick="copyShareLink()" style="margin-top: 5px; padding: 5px 10px; background: #8e44ad; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            Copy Link
                        </button>
                    `;
                    saveStatus.style.color = 'green';
                }
            }
        } else {
            // Supabase not available, use sessionStorage fallback
            console.warn('Supabase client not available, using sessionStorage fallback');
            sessionStorage.setItem(`card_${cardId}`, JSON.stringify(cardData));
        }
    } catch (err) {
        console.error('Error connecting to Supabase:', err);
        // Fallback to sessionStorage if Supabase fails
        sessionStorage.setItem(`card_${cardId}`, JSON.stringify(cardData));
    }
}

// Function to copy share link to clipboard
function copyShareLink() {
    const linkInput = document.getElementById('share-link-input');
    if (linkInput) {
        linkInput.select();
        document.execCommand('copy');
        alert('Link copied to clipboard!');
    }
}

// Function to load card data from localStorage
function loadCardData() {
    const savedData = localStorage.getItem('vesakCardData');
    
    if (savedData) {
        const cardData = JSON.parse(savedData);
        
        // Set form values
        document.getElementById('recipient').value = cardData.recipient || '';
        document.getElementById('message').value = cardData.message || '';
        document.getElementById('theme').value = cardData.theme || 'gold';
        
        // Set sender name if available
        if (document.getElementById('sender-name')) {
            document.getElementById('sender-name').value = cardData.sender || '';
        }
        
        // Apply theme
        document.body.className = '';
        if (cardData.theme) {
            document.body.classList.add(`${cardData.theme}-theme`);
        }
        
        // Update display if data exists
        if (cardData.recipient || cardData.message) {
            const personalMessageDiv = document.getElementById('personal-message-display');
            const recipientDisplay = document.getElementById('recipient-display');
            const messageDisplay = document.getElementById('message-display');
            const senderDisplay = document.getElementById('sender-display');
            
            personalMessageDiv.style.display = 'block';
            recipientDisplay.textContent = cardData.recipient || 'Friend';
            messageDisplay.textContent = cardData.message || 'Wishing you peace and joy on this Vesak Day.';
            
            // Update sender display
            if (senderDisplay) {
                senderDisplay.textContent = cardData.sender || 'You';
            }
        }
    }
}

// Function to check URL for shared card
async function checkForSharedCard() {
    const urlParams = new URLSearchParams(window.location.search);
    const cardId = urlParams.get('card');
    
    if (cardId) {
        // First check if this is our own card
        const localCardId = localStorage.getItem('vesakCardId');
        
        if (cardId === localCardId) {
            // It's our card, load local data
            loadCardData();
            return;
        }
        
        // Try to get card data from Supabase
        try {
            // Check if Supabase client is available and properly initialized
            if (typeof supabase !== 'undefined' && supabase && typeof supabase.from === 'function') {
                // Clear any existing notice
                const existingNotice = document.querySelector('.share-notice');
                if (existingNotice) {
                    existingNotice.remove();
                }
                
                // Show loading state
                const customizeSection = document.querySelector('.customize-section');
                const loadingNotice = document.createElement('div');
                loadingNotice.className = 'share-notice loading';
                loadingNotice.innerHTML = '<p>Loading shared card data...</p>';
                customizeSection.insertBefore(loadingNotice, customizeSection.firstChild);
                
                console.log('Fetching card with ID:', cardId);
                
                // Modified query to avoid 406 error - don't use single() which can cause the 406 error
                const { data, error } = await supabase
                    .from('vesak_cards')
                    .select('*')
                    .eq('card_id', cardId);
                
                // Remove loading notice
                loadingNotice.remove();
                    
                if (error) {
                    console.error('Error fetching card from Supabase:', error);
                    
                    // Fallback to session storage
                    const sessionData = sessionStorage.getItem(`card_${cardId}`);
                    if (sessionData) {
                        loadSharedCardData(JSON.parse(sessionData));
                    } else {
                        displayEmptySharedCard(true);
                    }
                } else if (data && data.length > 0) {
                    // We found the card in Supabase - use the first match
                    console.log('Found card data:', data[0]);
                    loadSharedCardData({
                        recipient: data[0].recipient,
                        message: data[0].message,
                        theme: data[0].theme,
                        sender: data[0].sender
                    });
                } else {
                    console.log('No data found for card ID:', cardId);
                    // No data found in Supabase
                    displayEmptySharedCard(true);
                }
            } else {
                // Supabase not available, check sessionStorage
                console.warn('Supabase client not available, checking sessionStorage');
                const sessionData = sessionStorage.getItem(`card_${cardId}`);
                if (sessionData) {
                    loadSharedCardData(JSON.parse(sessionData));
                } else {
                    displayEmptySharedCard(true);
                }
            }
        } catch (err) {
            console.error('Error connecting to Supabase:', err);
            
            // Fallback to session storage
            const sessionData = sessionStorage.getItem(`card_${cardId}`);
            if (sessionData) {
                loadSharedCardData(JSON.parse(sessionData));
            } else {
                displayEmptySharedCard(true);
            }
        }
    }
}

// Function to load shared card data
function loadSharedCardData(cardData) {
    console.log('Loading shared card data:', cardData);
    
    // Set form values (but don't apply them yet)
    document.getElementById('recipient').value = cardData.recipient || '';
    document.getElementById('message').value = cardData.message || '';
    document.getElementById('theme').value = cardData.theme || 'gold';
    
    // Apply the theme immediately
    document.body.className = '';
    if (cardData.theme) {
        document.body.classList.add(`${cardData.theme}-theme`);
    }
    
    // Store original sender's card data
    const originalCardData = {
        recipient: cardData.recipient || '',
        message: cardData.message || '',
        theme: cardData.theme || 'gold',
        sender: cardData.sender || 'Anonymous' // Store sender name if available
    };
    
    // Create variable to track if we're viewing original or creating new
    let viewingOriginal = true;
    
    // Update display if recipient and message exist
    if (cardData.recipient || cardData.message) {
        const personalMessageDiv = document.getElementById('personal-message-display');
        const recipientDisplay = document.getElementById('recipient-display');
        const messageDisplay = document.getElementById('message-display');
        const senderDisplay = document.getElementById('sender-display');
        const sharedCardActions = document.getElementById('shared-card-actions');
        const customizeSection = document.querySelector('.customize-section');
        
        // Display the message
        personalMessageDiv.style.display = 'block';
        recipientDisplay.textContent = cardData.recipient || 'Friend';
        messageDisplay.textContent = cardData.message || 'Wishing you peace and joy on this Vesak Day.';
        
        // Display the sender name if available
        if (cardData.sender) {
            senderDisplay.textContent = cardData.sender;
        } else {
            senderDisplay.textContent = 'Anonymous'; // Default if sender name not provided
        }
        
        // Show action buttons
        sharedCardActions.style.display = 'flex';
        
        // Hide the customize section initially
        customizeSection.style.display = 'none';
        
        // Add success notice
        const successNotice = document.createElement('div');
        successNotice.className = 'share-notice success';
        successNotice.innerHTML = `
            <p style="color: green">✓ Shared card loaded successfully!</p>
            <p>You're viewing a card that was shared with you.</p>
            <p>Use the buttons below to create your own card or share this one further.</p>
        `;
        
        // Insert at the top of the card back
        const cardBack = document.querySelector('.card-back');
        cardBack.insertBefore(successNotice, cardBack.firstChild.nextSibling);
        
        // Add event listeners for the action buttons
        const createOwnBtn = document.getElementById('create-own-btn');
        const shareReceivedBtn = document.getElementById('share-received-btn');
        
        // Create own button functionality
        createOwnBtn.addEventListener('click', function() {
            // Toggle visibility
            customizeSection.style.display = 'block';
            sharedCardActions.style.display = 'none';
            
            // Change notice
            successNotice.innerHTML = `
                <p>You can now create your own personalized card.</p>
                <p>Customize the message below and click "Apply" to see your changes.</p>
            `;
            
            // Track that we're creating our own
            viewingOriginal = false;
            
            // Change apply button text
            document.getElementById('apply-btn').textContent = 'Apply Changes';
            
            // Hide the current card display until they apply changes
            personalMessageDiv.style.display = 'none';
        });
        
        // Share received button functionality
        shareReceivedBtn.addEventListener('click', function() {
            // Just show share options for the current card
            showShareOptions();
        });
        
        // Modify Apply button behavior
        const applyBtn = document.getElementById('apply-btn');
        const originalApplyEvent = applyBtn.onclick;
        
        applyBtn.addEventListener('click', function() {
            // If viewing original, do nothing special
            if (!viewingOriginal) {
                // We're creating our own card, so generate a new card ID
                localStorage.removeItem('vesakCardId');
                
                // Change notice
                successNotice.innerHTML = `
                    <p style="color: green">✓ Your new card has been created!</p>
                    <p>Now you can share your personalized version with others.</p>
                `;
                
                // Show the personal message with new content
                personalMessageDiv.style.display = 'block';
                
                // Reset sender to "You" for the new card
                senderDisplay.textContent = "You";
            }
        });
    }
    
    // Flip the card automatically to show the message
    setTimeout(() => {
        document.querySelector('.card').classList.add('flipped');
    }, 1000);
}

// Function to display an empty shared card with a message
function displayEmptySharedCard(isSupabaseError = false) {
    // Get the customize section and add notice at the top
    const customizeSection = document.querySelector('.customize-section');
    const sharedCardActions = document.getElementById('shared-card-actions');
    
    // Check if notice already exists
    if (document.querySelector('.share-notice')) {
        return;
    }
    
    // Create notice element
    const noticeElement = document.createElement('div');
    noticeElement.className = 'share-notice';
    
    if (isSupabaseError) {
        noticeElement.innerHTML = `
            <p>This is a shared Vesak card link.</p>
            <p>There was an issue connecting to our server to retrieve the card data.</p>
            <p>This may happen if you haven't set up Supabase yet. <a href="#" id="setup-help">Need help setting up?</a></p>
        `;
    } else {
        noticeElement.innerHTML = `
            <p>This is a shared Vesak card link.</p>
            <p>The sender's message will appear here once the server connection is established.</p>
            <p>You can also create your own card below.</p>
        `;
    }
    
    // Insert at the top of the card back (not just the customize section)
    const cardBack = document.querySelector('.card-back');
    cardBack.insertBefore(noticeElement, cardBack.firstChild.nextSibling);
    
    // Hide customize section initially
    customizeSection.style.display = 'none';
    
    // Show the action buttons
    sharedCardActions.style.display = 'flex';
    
    // Add event listeners to the action buttons
    const createOwnBtn = document.getElementById('create-own-btn');
    const shareReceivedBtn = document.getElementById('share-received-btn');
    
    // Create own button functionality
    createOwnBtn.addEventListener('click', function() {
        // Show customize section
        customizeSection.style.display = 'block';
        
        // Hide action buttons
        sharedCardActions.style.display = 'none';
        
        // Update notice
        noticeElement.innerHTML = `
            <p>You can now create your own personalized card.</p>
            <p>Customize the message below and click "Apply" to see your changes.</p>
        `;
        
        // Clean any old card ID
        localStorage.removeItem('vesakCardId');
    });
    
    // For sharing the default card
    shareReceivedBtn.addEventListener('click', function() {
        showShareOptions();
    });
    
    // Add setup help click handler
    const setupHelpLink = document.getElementById('setup-help');
    if (setupHelpLink) {
        setupHelpLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('To set up Supabase:\n\n1. Create a Supabase account at supabase.com\n2. Create a new project\n3. Create a "vesak_cards" table with the schema from SUPABASE_SETUP.md\n4. Copy your project URL and anon key to config.js\n\nSee SUPABASE_SETUP.md for detailed instructions.');
        });
    }
    
    // Add styling
    const style = document.createElement('style');
    style.textContent = `
        .share-notice {
            background-color: rgba(142, 68, 173, 0.1);
            border-left: 4px solid var(--primary-color);
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
            color: var(--primary-color);
            font-size: 14px;
            line-height: 1.5;
        }
        
        .share-notice p {
            margin: 5px 0;
        }
        
        .share-notice a {
            color: var(--primary-color);
            text-decoration: underline;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
    
    // Make the "Apply" button more prominent
    const applyBtn = document.getElementById('apply-btn');
    applyBtn.textContent = 'Create Your Own Card';
    applyBtn.style.fontSize = '16px';
    applyBtn.style.padding = '12px 20px';
    applyBtn.style.backgroundColor = '#27ae60';
    
    // Still flip the card to show the back with the form
    setTimeout(() => {
        document.querySelector('.card').classList.add('flipped');
    }, 1000);
}

// Function to download card as image
function downloadCardAsImage() {
    if (typeof html2canvas === 'undefined') {
        alert('Image download functionality is loading. Please try again in a moment.');
        loadHtml2Canvas(downloadCardAsImage);
        return;
    }
    
    // Make sure card is flipped to show back side with message
    const card = document.querySelector('.card');
    if (!card.classList.contains('flipped')) {
        card.classList.add('flipped');
        
        // Wait a bit for the flip animation to complete before capturing
        setTimeout(() => {
            captureAndDownloadCard();
        }, 1000);
    } else {
        captureAndDownloadCard();
    }
}

// Function to capture and download the card
function captureAndDownloadCard() {
    // Get the customized content
    const recipient = document.getElementById('recipient').value.trim() || 'Friend';
    const message = document.getElementById('message').value.trim() || 'Wishing you peace and joy on this Vesak Day.';
    const theme = document.getElementById('theme').value || 'gold';
    const sender = document.getElementById('sender-display').textContent || 'You';
    
    // Create a completely new card element specifically for capturing
    const captureContainer = document.createElement('div');
    captureContainer.className = 'capture-container';
    captureContainer.style.position = 'absolute';
    captureContainer.style.left = '-9999px';
    captureContainer.style.width = '800px';
    captureContainer.style.height = '600px';
    captureContainer.style.overflow = 'hidden';
    
    // Add the theme class to the capture container
    captureContainer.classList.add(`${theme}-theme`);
    
    // Create the card HTML structure directly (without flipping)
    captureContainer.innerHTML = `
        <div class="card-for-capture" style="width: 100%; height: 100%; border-radius: 15px; overflow: hidden; 
             background: linear-gradient(135deg, #f8f9fa, #e9ecef); color: var(--text-color);
             padding: 30px; display: flex; flex-direction: column; justify-content: space-between; 
             align-items: center; text-align: center; box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);">
            
            <div class="candle-container">
                <div class="candle">
                    <div class="flame">
                        <div class="waves"></div>
                        <div class="glow"></div>
                    </div>
                    <div class="wax"></div>
                </div>
            </div>
            
            <h2 style="font-size: 1.8rem; margin: 0.5em 0; color: var(--primary-color);">
                May the light of Buddha's teachings
            </h2>
            
            <p style="margin: 0.8em 0; line-height: 1.6;">
                illuminate your path to peace and enlightenment
            </p>
            
            <div class="quote" style="margin: 20px 0; padding: 10px; border-left: 4px solid var(--primary-color);
                 background-color: rgba(255, 255, 255, 0.7); border-radius: 5px; text-align: left; width: 80%;">
                <p style="margin: 0.5em 0;">"Peace comes from within. Do not seek it without."</p>
                <p style="text-align: right; font-style: italic; margin-top: 5px;">- Buddha</p>
            </div>
            
            <div class="personal-message" style="width: 90%; max-width: 450px; margin: 15px auto;
                 padding: 20px; background: rgba(255, 255, 255, 0.8); border-radius: 10px;
                 border: 1px dashed var(--primary-color); display: block;">
                <p class="to" style="font-weight: bold; color: var(--primary-color);">
                    To: <span>${recipient}</span>
                </p>
                <p class="message-text" style="font-style: italic; margin: 15px 0;">
                    ${message}
                </p>
                <p class="from" style="font-weight: bold; color: var(--primary-color);">
                    From: <span>${sender}</span>
                </p>
            </div>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(captureContainer);
    
    // Capture the element
    setTimeout(() => {
        html2canvas(captureContainer, {
            allowTaint: true,
            useCORS: true,
            backgroundColor: null,
            scale: 2,
            logging: true
        }).then(canvas => {
            // Create download link
            const link = document.createElement('a');
            link.download = 'vesak-card.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            // Clean up
            document.body.removeChild(captureContainer);
        }).catch(error => {
            console.error('Error generating image:', error);
            alert('Could not generate image. Please try again.');
            
            // Clean up
            document.body.removeChild(captureContainer);
        });
    }, 300); // Give more time for rendering
}

// Function to load html2canvas script
function loadHtml2Canvas(callback) {
    if (typeof html2canvas !== 'undefined') return;
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
    script.onload = function() {
        console.log('html2canvas loaded successfully from direct call');
        if (callback) callback();
    };
    script.onerror = function() {
        console.error('Failed to load html2canvas, trying alternative source');
        // Try alternative CDN if main one failed
        const fallbackScript = document.createElement('script');
        fallbackScript.src = 'https://cdn.jsdelivr.net/gh/niklasvh/html2canvas/dist/html2canvas.min.js';
        fallbackScript.onload = function() {
            console.log('html2canvas loaded from fallback source');
            if (callback) callback();
        };
        fallbackScript.onerror = function() {
            console.error('All attempts to load html2canvas failed');
            alert('Could not load required libraries. Please check your internet connection and try again.');
        };
        document.head.appendChild(fallbackScript);
    };
    document.head.appendChild(script);
}

// Add CSS for highlight animation
const style = document.createElement('style');
style.innerHTML = `
.highlight {
    animation: highlight-pulse 1s ease-in-out;
}

@keyframes highlight-pulse {
    0% { box-shadow: 0 0 0 rgba(142, 68, 173, 0.5); }
    50% { box-shadow: 0 0 20px rgba(142, 68, 173, 0.8); }
    100% { box-shadow: 0 0 0 rgba(142, 68, 173, 0.5); }
}
`;
document.head.appendChild(style);

// Function to create and download a video of the card
function createCardVideo() {
    // Show recording indicator
    const indicator = document.createElement('div');
    indicator.className = 'recording-indicator';
    indicator.innerHTML = '<div class="recording-dot"></div> Creating animation...';
    document.body.appendChild(indicator);
    
    // Get the customized content
    const recipient = document.getElementById('recipient').value.trim() || 'Friend';
    const message = document.getElementById('message').value.trim() || 'Wishing you peace and joy on this Vesak Day.';
    const theme = document.getElementById('theme').value || 'gold';
    const sender = document.getElementById('sender-display').textContent || 'You';
    
    // Create animation container (hidden from view)
    const animationContainer = document.createElement('div');
    animationContainer.id = 'animation-container';
    animationContainer.style.position = 'absolute';
    animationContainer.style.left = '-9999px';
    animationContainer.style.top = '-9999px';
    animationContainer.style.width = '800px';
    animationContainer.style.height = '600px';
    animationContainer.style.overflow = 'hidden';
    
    // Create card element for animation
    const animatedCard = document.createElement('div');
    animatedCard.className = `animated-card ${theme}-theme`;
    animatedCard.style.width = '100%';
    animatedCard.style.height = '100%';
    animatedCard.style.position = 'relative';
    animatedCard.style.transformStyle = 'preserve-3d';
    
    // Create front and back sides
    const cardFront = document.createElement('div');
    cardFront.className = 'animated-card-front';
    cardFront.style.position = 'absolute';
    cardFront.style.width = '100%';
    cardFront.style.height = '100%';
    cardFront.style.backfaceVisibility = 'hidden';
    cardFront.style.backgroundColor = '#8e44ad';
    cardFront.style.display = 'flex';
    cardFront.style.flexDirection = 'column';
    cardFront.style.justifyContent = 'center';
    cardFront.style.alignItems = 'center';
    cardFront.style.color = 'white';
    cardFront.style.borderRadius = '15px';
    cardFront.style.padding = '20px';
    cardFront.style.textAlign = 'center';
    
    cardFront.innerHTML = `
        <div class="lotus-animation">
            <div class="lotus-flower">
                ${Array(8).fill(0).map((_, i) => `<div class="lotus-petal" style="transform: rotate(${i * 45}deg);"></div>`).join('')}
                <div class="lotus-center"></div>
            </div>
        </div>
        <h1 style="font-size: 3rem; margin: 0.5em 0; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);">Happy Vesak</h1>
    `;
    
    const cardBack = document.createElement('div');
    cardBack.className = 'animated-card-back';
    cardBack.style.position = 'absolute';
    cardBack.style.width = '100%';
    cardBack.style.height = '100%';
    cardBack.style.backfaceVisibility = 'hidden';
    cardBack.style.backgroundColor = '#f8f9fa';
    cardBack.style.display = 'flex';
    cardBack.style.flexDirection = 'column';
    cardBack.style.justifyContent = 'space-between';
    cardBack.style.alignItems = 'center';
    cardBack.style.color = '#333';
    cardBack.style.borderRadius = '15px';
    cardBack.style.padding = '20px';
    cardBack.style.textAlign = 'center';
    cardBack.style.transform = 'rotateY(180deg)';
    
    cardBack.innerHTML = `
        <div class="candle-animation">
            <div class="animated-candle">
                <div class="animated-flame"></div>
                <div class="animated-wax"></div>
            </div>
        </div>
        <h2 style="font-size: 1.8rem; margin: 0.5em 0; color: var(--primary-color);">May the light of Buddha's teachings</h2>
        <p style="margin: 0.8em 0; line-height: 1.6;">illuminate your path to peace and enlightenment</p>
        <div style="margin: 20px 0; padding: 10px; border-left: 4px solid var(--primary-color); background-color: rgba(255, 255, 255, 0.7); border-radius: 5px; width: 80%;">
            <p style="margin: 0.5em 0;">"Peace comes from within. Do not seek it without."</p>
            <p style="text-align: right; font-style: italic; margin-top: 5px;">- Buddha</p>
        </div>
        <div style="width: 90%; max-width: 450px; margin: 15px auto; padding: 20px; background: rgba(255, 255, 255, 0.8); border-radius: 10px; border: 1px dashed var(--primary-color);">
            <p style="font-weight: bold; color: var(--primary-color);">To: <span>${recipient}</span></p>
            <p style="font-style: italic; margin: 15px 0;">${message}</p>
            <p style="font-weight: bold; color: var(--primary-color);">From: <span>${sender}</span></p>
        </div>
    `;
    
    // Add animation styles
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        .lotus-animation {
            width: 200px;
            height: 200px;
            margin: 20px auto;
            position: relative;
        }
        
        .lotus-flower {
            width: 100%;
            height: 100%;
            position: relative;
            animation: rotate 10s linear infinite;
        }
        
        .lotus-petal {
            position: absolute;
            width: 60px;
            height: 100px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50% 50% 0 0;
            top: 50%;
            left: 50%;
            transform-origin: bottom center;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
        
        .lotus-center {
            position: absolute;
            width: 50px;
            height: 50px;
            background: #f1c40f;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 20px #f1c40f;
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .candle-animation {
            width: 80px;
            height: 120px;
            margin: 20px auto;
            position: relative;
        }
        
        .animated-candle {
            position: relative;
            width: 40px;
            height: 100px;
            background: #fff;
            margin: 0 auto;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        
        .animated-flame {
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            width: 20px;
            height: 40px;
            background: #f1c40f;
            border-radius: 50% 50% 20% 20%;
            box-shadow: 0 0 20px #f1c40f, 0 0 40px #f1c40f;
            animation: flicker 0.5s infinite alternate;
        }
        
        .animated-wax {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #fff;
            border-radius: 5px;
        }
        
        @keyframes flicker {
            0% { transform: translateX(-50%) scale(1); }
            100% { transform: translateX(-52%) scale(0.98); }
        }
    `;
    document.head.appendChild(animationStyle);
    
    // Add card elements to container
    animatedCard.appendChild(cardFront);
    animatedCard.appendChild(cardBack);
    animationContainer.appendChild(animatedCard);
    document.body.appendChild(animationContainer);
    
    // Create video quickly without frame-by-frame rendering
    createFastVideo(animatedCard, animationContainer, indicator, recipient, message, theme, sender);
}

// Function to create video quickly without frame-by-frame rendering
function createFastVideo(animatedCard, container, indicator, recipient, message, theme, sender) {
    // Check for WebM and MediaRecorder support
    if (typeof MediaRecorder === 'undefined') {
        alert('Your browser does not support the MediaRecorder API. Please try a different browser like Chrome or Firefox.');
        document.body.removeChild(indicator);
        document.body.removeChild(container);
        return;
    }
    
    // Using a fallback GIF approach if WebM isn't working well
    indicator.innerHTML = '<div class="recording-dot"></div> Creating animation...';
    
    // Create frames directly at key points for smoother animation
    const totalFrames = 30;
    const frames = [];
    
    // Pre-compute key rotation values
    const rotations = [];
    for (let i = 0; i < totalFrames; i++) {
        // First third: stay at front (0 degrees)
        // Middle third: rotate from 0 to 180
        // Last third: stay at back (180 degrees)
        let rotation;
        if (i < totalFrames / 3) {
            rotation = 0;
        } else if (i < 2 * totalFrames / 3) {
            const progress = (i - totalFrames / 3) / (totalFrames / 3);
            rotation = progress * 180;
        } else {
            rotation = 180;
        }
        rotations.push(rotation);
    }
    
    // Create canvas for rendering
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    canvas.style.position = 'absolute';
    canvas.style.left = '-9999px';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Instead of trying to use MediaRecorder which might be causing issues,
    // let's create a GIF animation which has better compatibility
    loadGifWorker(() => {
        const gif = new GIF({
            workers: 2,
            quality: 10,
            width: canvas.width,
            height: canvas.height,
            workerScript: 'https://cdn.jsdelivr.net/gh/jnordberg/gif.js/dist/gif.worker.js'
        });
        
        // Render each frame
        let frameIndex = 0;
        
        function renderNextFrame() {
            if (frameIndex >= totalFrames) {
                // Finish and render GIF
                gif.on('finished', function(blob) {
                    // Create download link
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'vesak-card-animation.gif';
                    link.style.display = 'none';
                    document.body.appendChild(link);
                    
                    // Remove indicator and container
                    document.body.removeChild(indicator);
                    document.body.removeChild(container);
                    document.body.removeChild(canvas);
                    
                    // Trigger download
                    link.click();
                    document.body.removeChild(link);
                });
                
                gif.render();
                return;
            }
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Apply rotation
            const rotation = rotations[frameIndex];
            
            // Render the card
            renderCard(canvas, ctx, rotation, recipient, message, theme, sender);
            
            // Add frame to GIF
            gif.addFrame(canvas, {copy: true, delay: 100});
            
            // Update progress
            const progress = frameIndex / totalFrames;
            indicator.innerHTML = `<div class="recording-dot"></div> Creating animation... ${Math.round(progress * 100)}%`;
            
            // Go to next frame
            frameIndex++;
            setTimeout(renderNextFrame, 10);
        }
        
        // Start rendering
        renderNextFrame();
    });
}

// Function to load gif.js worker
function loadGifWorker(callback) {
    // Load gif.js script if not already loaded
    if (typeof GIF === 'undefined') {
        const gifScript = document.createElement('script');
        gifScript.src = 'https://cdn.jsdelivr.net/gh/jnordberg/gif.js/dist/gif.js';
        gifScript.onload = function() {
            callback();
        };
        document.head.appendChild(gifScript);
    } else {
        callback();
    }
}

// Function to render the card to a canvas
function renderCard(canvas, ctx, rotation, recipient, message, theme, sender) {
    // Use a more direct approach for rendering
    ctx.fillStyle = '#8e44ad';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Simplified rendering based on rotation
    if (rotation < 90) {
        // Show front
        const frontOpacity = Math.cos(rotation * Math.PI / 180);
        ctx.globalAlpha = frontOpacity;
        ctx.fillStyle = theme === 'blue' ? '#3498db' : 
                       theme === 'green' ? '#27ae60' : '#8e44ad';
        ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);
        
        // Add simple text for front
        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Happy Vesak', canvas.width/2, canvas.height/2 - 50);
        
        // Draw a simple lotus
        drawSimpleLotus(ctx, canvas.width/2, canvas.height/2 - 150, theme);
    } else {
        // Show back
        const backOpacity = Math.cos((180 - rotation) * Math.PI / 180);
        ctx.globalAlpha = backOpacity;
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);
        
        // Add simple text for back
        const primaryColor = theme === 'blue' ? '#3498db' : 
                            theme === 'green' ? '#27ae60' : '#8e44ad';
        
        ctx.fillStyle = primaryColor;
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('May the light of Buddha\'s teachings', canvas.width/2, 150);
        
        // Draw message box
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        const msgBoxWidth = 500;
        const msgBoxHeight = 200;
        const msgBoxX = (canvas.width - msgBoxWidth) / 2;
        const msgBoxY = 350;
        
        ctx.fillRect(msgBoxX, msgBoxY, msgBoxWidth, msgBoxHeight);
        ctx.strokeStyle = primaryColor;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(msgBoxX, msgBoxY, msgBoxWidth, msgBoxHeight);
        
        // Draw candle
        drawCandle(ctx, canvas.width/2, 220, theme);
        
        // Draw text
        ctx.fillStyle = '#333';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(`To: ${recipient}`, canvas.width/2, msgBoxY + 40);
        
        ctx.font = 'italic 20px Arial';
        
        // Handle long messages by wrapping text
        const words = message.split(' ');
        let line = '';
        let y = msgBoxY + 100;
        const maxWidth = msgBoxWidth - 40;
        
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && i > 0) {
                ctx.fillText(line, canvas.width/2, y);
                line = words[i] + ' ';
                y += 30;
                
                // Check if we're running out of space
                if (y > msgBoxY + 160) {
                    ctx.fillText(line + '...', canvas.width/2, y);
                    break;
                }
            } else {
                line = testLine;
            }
        }
        
        // Draw last line if there's room
        if (y <= msgBoxY + 160) {
            ctx.fillText(line, canvas.width/2, y);
            ctx.font = 'bold 24px Arial';
            ctx.fillText(`From: ${sender || 'You'}`, canvas.width/2, msgBoxY + 160);
        }
    }
    
    // Reset opacity
    ctx.globalAlpha = 1;
}

// Function to draw a simplified lotus flower
function drawSimpleLotus(ctx, x, y, theme) {
    const petalCount = 8;
    const radius = 80;
    
    // Draw petals
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(0, -radius/2, 30, 50, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    // Draw center with theme color
    const centerColor = theme === 'blue' ? '#ecf0f1' : 
                        theme === 'green' ? '#f1c40f' : '#f1c40f';
    
    ctx.fillStyle = centerColor;
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();
}

// Function to draw a candle
function drawCandle(ctx, x, y, theme) {
    // Candle base
    ctx.fillStyle = '#fff';
    ctx.fillRect(x - 20, y - 10, 40, 100);
    
    // Flame color based on theme
    const flameColor = theme === 'blue' ? '#ecf0f1' : 
                      theme === 'green' ? '#f1c40f' : '#f1c40f';
    
    // Draw flame
    ctx.fillStyle = flameColor;
    ctx.beginPath();
    ctx.ellipse(x, y - 40, 10, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Glow effect
    const gradient = ctx.createRadialGradient(x, y - 40, 5, x, y - 40, 30);
    gradient.addColorStop(0, flameColor);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(x, y - 40, 20, 40, 0, 0, Math.PI * 2);
    ctx.fill();
} 