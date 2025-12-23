
/**
 * Smart Pricing Simulation: "The Falling Umarel"
 * 
 * Logic:
 * - Sell first K tickets at Premium Price (P_high).
 * - Sell remaining (N-K) tickets at Discount Price (P_low).
 * - Goal: Cover fixed costs with P_high, then profit/fill with P_low.
 */

interface PricingConfig {
    totalSpots: number;
    premiumThreshold: number; // e.g., 4
    premiumPrice: number;     // e.g., 50
    discountPrice: number;    // e.g., 20
}

class TicketSalesEngine {
    private soldCount = 0;
    private config: PricingConfig;
    private revenue = 0;

    constructor(config: PricingConfig) {
        this.config = config;
    }

    getCurrentPrice(): number {
        // If we haven't sold the premium threshold yet, price is high
        if (this.soldCount < this.config.premiumThreshold) {
            return this.config.premiumPrice;
        }
        // Otherwise, clear the inventory
        return this.config.discountPrice;
    }

    buyTicket(buyerName: string): void {
        if (this.soldCount >= this.config.totalSpots) {
            console.log(`❌ ${buyerName} tried to buy, but event is SOLD OUT.`);
            return;
        }

        const price = this.getCurrentPrice();
        this.soldCount++;
        this.revenue += price;
        console.log(`✅ ${buyerName} bought Spot #${this.soldCount} for $${price}. (Total Rev: $${this.revenue})`);
    }

    getStats() {
        return {
            sold: this.soldCount,
            revenue: this.revenue,
            nextPrice: this.soldCount < this.config.totalSpots ? this.getCurrentPrice() : 0
        };
    }
}

// --- Simulation ---

console.log("🚲 Starting Simulation: Maria's Bike Ride 🚲");
console.log("-------------------------------------------");

const engine = new TicketSalesEngine({
    totalSpots: 10,
    premiumThreshold: 4,
    premiumPrice: 50,  // High willingness to pay
    discountPrice: 20  // "Cinema Empty Seat" price
});

const buyers = [
    "Alessandro (Fan)", "Bianca (Fan)", "Carlo (Rich)", "Dino (Eager)", // First 4
    "Enzo (Waiter)", "Fabio (Cheap)", "Gina (Student)", // Discount Hunters
    "Hugo", "Ivo", "Jan", "Karl" // Latecomers
];

buyers.forEach(buyer => {
    engine.buyTicket(buyer);
});

console.log("-------------------------------------------");
console.log("Simulation Complete.");
