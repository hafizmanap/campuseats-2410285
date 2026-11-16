import { useState } from 'react';
import { seedDemoData } from '../services/vendors.js';

function SeedPage() {
    const [message, setMessage] = useState('');

    async function handleSeed() {
        setMessage('Seeding demo data...');
        try{
            const res = await fetch('/api/vendors.json');
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const vendors = await res.json();
            await seedDemoData(vendors);
            setMessage(`Done: ${vendors.length} vendors written to Firestore.`);
        } catch (error) {
            console.error('Error seeding demo data:', error);
            setMessage(`Failed: ${error.message}`);
        }
    }

    return (
        <section className="card">
            <h2 className="section-title">Seed Firestore</h2>
            <button className="btn" onClick={handleSeed}>
                Seed Demo Data
            </button>
            {message && <p>{message}</p>}
        </section>
    )
}

export default SeedPage;