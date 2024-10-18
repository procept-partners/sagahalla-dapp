import React from 'react';

const AboutPage = () => {
    return (
        <div className="about-page container mx-auto px-4 py-8">
            <h1 className="mb-4 text-4xl font-bold text-gray-800">About Saga Mana Dapp</h1>
            <p className="mb-6 text-lg text-gray-700">Welcome to our Saga Mana Dapp application.</p>
            <ul className="mb-6 list-inside list-disc text-lg text-gray-700">
                <li>Feature 1: Description</li>
                <li>Feature 2: Description</li>
                <li>Feature 3: Description</li>
            </ul>
            <p className="text-lg text-gray-700">
                Contact us at: <a href="mailto:support@sagahalla.io" className="text-blue-500 hover:underline">support@sagamana.com</a>
            </p>
        </div>
    );
};

export default AboutPage;
