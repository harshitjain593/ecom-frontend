import React from 'react';
import './faq.css'; // Ensure you create this CSS file for styling

const Faq = () => {
    const faqs = [
        {
            question: "What is the return policy?",
            answer: "You can return most items within 30 days of receipt for a full refund."
        },
        {
            question: "Do you offer international shipping?",
            answer: "Yes, we offer international shipping to many countries. Please check our shipping policy for more details."
        },
        {
            question: "How can I track my order?",
            answer: "Once your order has been shipped, you will receive a tracking number via email."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept major credit cards, PayPal, and other secure payment methods."
        },
        {
            question: "How do I change my order?",
            answer: "To change your order, please contact our customer service as soon as possible. Changes can only be made before the order is processed."
        },
        {
            question: "What should I do if I received a damaged item?",
            answer: "Please contact our customer service team immediately with your order number and photos of the damaged item."
        },
        {
            question: "Can I cancel my order?",
            answer: "Orders can be canceled if they have not been processed yet. Contact our customer service to request a cancellation."
        },
        {
            question: "Do you offer gift cards?",
            answer: "Yes, we offer gift cards in various denominations. You can purchase them on our website."
        },
        {
            question: "How do I return an item?",
            answer: "To return an item, please visit our returns page and follow the instructions provided."
        },
        {
            question: "Where can I find your size guide?",
            answer: "Our size guide can be found on the product page under the 'Size Guide' tab."
        }
    ];

    return (
        <div className="qa-container">
            <h2>Frequently Asked Questions</h2>
            <ul className="qa-list">
                {faqs.map((faq, index) => (
                    <li key={index} className="qa-item">
                        <h3 color='#2460b7' >{faq.question}</h3>
                        <p>{faq.answer}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Faq;
