// Popup Queue Module
// Manages sequential display of popup messages with delays to ensure visibility

class PopupQueue {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
        this.defaultDelay = 1500; // 1.5 seconds between popups
    }

    // Add a popup to the queue
    enqueue(message, delay = this.defaultDelay) {
        this.queue.push({ message, delay });
        
        // Start processing if not already processing
        if (!this.isProcessing) {
            this.processQueue();
        }
    }

    // Process the queue
    async processQueue() {
        if (this.queue.length === 0) {
            this.isProcessing = false;
            return;
        }

        this.isProcessing = true;
        
        while (this.queue.length > 0) {
            const { message, delay } = this.queue.shift();
            
            // Show the popup
            alert(message);
            
            // Wait before showing the next popup (if there are more)
            if (this.queue.length > 0) {
                await this.sleep(delay);
            }
        }

        this.isProcessing = false;
    }

    // Helper to create a delay
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Clear all pending popups
    clear() {
        this.queue = [];
    }

    // Check if queue is empty
    isEmpty() {
        return this.queue.length === 0;
    }
}

// Create a singleton instance
export const popupQueue = new PopupQueue();
