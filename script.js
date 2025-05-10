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
    
    // Hide save-status element
    const saveStatus = document.getElementById('save-status');
    if (saveStatus) {
        saveStatus.style.display = 'none';
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
    
    // Assemble modal
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(header);
    modalContent.appendChild(linkSection);
    modalContent.appendChild(socialSection);
    
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
        
        .link-section, .social-section {
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
            // Hide save status element
            const saveStatus = document.getElementById('save-status');
            if (saveStatus) {
                saveStatus.style.display = 'none';
            }
            
            // First check if the card already exists
            const { data: existingCard, error: checkError } = await supabase
                .from('vesak_cards')
                .select('card_id')
                .eq('card_id', cardId);
                
            if (checkError) {
                console.error('Error checking if card exists:', checkError);
            }
            
            let result;
            
            if (existingCard && existingCard.length > 0) {
                // Card exists, update it
                result = await supabase
                    .from('vesak_cards')
                    .update({
                        recipient: cardData.recipient,
                        message: cardData.message,
                        theme: cardData.theme,
                        sender: cardData.sender,
                        created_at: new Date()
                    })
                    .eq('card_id', cardId)
                    .select();
            } else {
                // Card doesn't exist, insert it
                result = await supabase
                    .from('vesak_cards')
                    .insert({
                        card_id: cardId,
                        recipient: cardData.recipient,
                        message: cardData.message,
                        theme: cardData.theme,
                        sender: cardData.sender,
                        created_at: new Date()
                    })
                    .select();
            }
            
            const { data, error } = result;
                
            if (error) {
                console.error('Error saving card to Supabase:', error);
                // Save to sessionStorage as fallback
                sessionStorage.setItem(`card_${cardId}`, JSON.stringify(cardData));
            } else {
                console.log('Card saved to Supabase successfully:', data);
                
                // Auto-show share options instead of displaying success message
                showShareOptions();
            }
        } else {
            // Supabase not available, use sessionStorage fallback
            console.warn('Supabase client not available, using sessionStorage fallback');
            sessionStorage.setItem(`card_${cardId}`, JSON.stringify(cardData));
            
            // Still show share options
            showShareOptions();
        }
    } catch (err) {
        console.error('Error connecting to Supabase:', err);
        // Fallback to sessionStorage if Supabase fails
        sessionStorage.setItem(`card_${cardId}`, JSON.stringify(cardData));
        
        // Still show share options
        showShareOptions();
    }
}

// Function to copy share link to clipboard
function copyShareLink() {
    const linkInput = document.getElementById('share-link-input');
    if (linkInput) {
        linkInput.select();
        document.execCommand('copy');
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
                
                console.log('Fetching card with ID:', cardId);
                
                // Modified query to avoid 406 error - don't use single() which can cause the 406 error
                const { data, error } = await supabase
                    .from('vesak_cards')
                    .select('*')
                    .eq('card_id', cardId);
                
                // No loading notice to remove
                    
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
        
        // Add event listeners for the action buttons
        const createOwnBtn = document.getElementById('create-own-btn');
        const shareReceivedBtn = document.getElementById('share-received-btn');
        
        // Create own button functionality
        createOwnBtn.addEventListener('click', function() {
            // Toggle visibility
            customizeSection.style.display = 'block';
            sharedCardActions.style.display = 'none';
            
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
        
        // Clean any old card ID
        localStorage.removeItem('vesakCardId');
    });
    
    // For sharing the default card
    shareReceivedBtn.addEventListener('click', function() {
        showShareOptions();
    });
    
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