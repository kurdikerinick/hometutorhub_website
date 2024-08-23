import React, { useState } from "react";
import TopNav from "./home";
import './fees.css'; // Import the CSS file for styling
import Photo from '../../images/payfees.jpg';

function Fees() {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [name, setName] = useState("");
    const [studentId, setStudentId] = useState("");
    const [utrCode, setUtrCode] = useState("");

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const upiCode = "shridharhi991@ybl"; // Replace with your actual PhonePe UPI ID

    const copyToClipboard = () => {
        navigator.clipboard.writeText(upiCode).then(() => {
            alert("UPI code copied to clipboard!");
        });
    };

    const handleSend = () => {
        if (name && studentId && utrCode) {
            // Save data to Firebase or handle submission here
            console.log("Form submitted:", { name, studentId, utrCode });
            alert("Details submitted successfully!");

            // Clear form fields after submission
            setName("");
            setStudentId("");
            setUtrCode("");
        } else {
            alert("Please fill out all fields.");
        }
    };

    return (
        <div className={`monitor-tests-container ${sidebarVisible ? 'sidebar-visible' : ''}`}>
            <TopNav isVisible={sidebarVisible} toggleSidebar={toggleSidebar} />
            <div className={`content ${sidebarVisible ? 'shifted' : ''}`}>
                <div className="payment-section">
                    <h1>Pay Your Fees</h1>
                    <div className="upi-code">
                        <p>UPI Code: {upiCode}</p>
                        <button onClick={copyToClipboard}>Copy UPI Code</button>
                    </div>
                    <div className="qr-code">
                        <img src={Photo} alt="PhonePe QR Code" className="qr-image" />
                    </div>
                    <p>Scan the QR code to pay through PhonePe.</p>
                    <div className="form-section">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Student ID"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Paste UTR Code here"
                            value={utrCode}
                            onChange={(e) => setUtrCode(e.target.value)}
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Fees;
