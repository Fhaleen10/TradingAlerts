require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function setupProducts() {
    try {
        // Get all products
        const products = await stripe.products.list();
        
        // Update metadata for each product
        for (const product of products.data) {
            let dailyLimit;
            
            if (product.name.includes('Free')) {
                dailyLimit = 7;
            } else if (product.name.includes('Basic')) {
                dailyLimit = 100;
            } else if (product.name.includes('Pro')) {
                dailyLimit = 500;
            }

            if (dailyLimit) {
                await stripe.products.update(product.id, {
                    metadata: {
                        dailyAlertLimit: dailyLimit.toString()
                    }
                });
                console.log(`Updated ${product.name} with daily limit: ${dailyLimit}`);
            }
        }

        console.log('Products updated successfully!');
        
        // List all products with their prices and metadata
        const updatedProducts = await stripe.products.list({
            expand: ['data.default_price']
        });
        
        console.log('\nCurrent Products:');
        updatedProducts.data.forEach(product => {
            console.log(`\nName: ${product.name}`);
            console.log(`ID: ${product.id}`);
            console.log(`Price ID: ${product.default_price.id}`);
            console.log(`Daily Limit: ${product.metadata.dailyAlertLimit}`);
            console.log(`Price: $${product.default_price.unit_amount / 100}/month`);
        });
        
    } catch (error) {
        console.error('Error setting up products:', error);
    }
}

setupProducts();
