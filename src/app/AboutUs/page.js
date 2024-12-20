"use client";
import React from "react";
import "./AboutUs.css";

function AboutUs() {
  return (
    <div className="about-page">
      <div className="about-content">
        <section className="mission-section">
          <h2>Running Room Management</h2>
          <p>
          Welcome to the official Room Booking Platform of the East Coast Railway, Government of India!

We aim to provide a seamless and user-friendly experience for passengers and visitors seeking comfortable and affordable lodging facilities across our stations and affiliated locations. Our platform ensures a smooth booking process, catering to the needs of railway travelers, officials, and guests.
          </p>
        </section>

        <section className="team-section">
          <h2>Meet Our Department</h2>
          <div className="team-grid">
            <div className="team-member">
              <img
                src="https://via.placeholder.com/150"
                alt="Team Member"
                className="team-photo"
              />
              <h3>Siva Naresh Parvatham</h3>
              <p>Sr.DEE(OP)</p>
            </div>
            <div className="team-member">
              <img
                src="https://via.placeholder.com/150"
                alt="Team Member"
                className="team-photo"
              />
              <h3>Sanchay Adari</h3>
              <p>DEE(OP)</p>
            </div>
            <div className="team-member">
              <img
                src="https://via.placeholder.com/150"
                alt="Team Member"
                className="team-photo"
              />
              <h3>S. Baliyar Singh</h3>
              <p>ADEE(OP)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutUs;
