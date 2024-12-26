"use client";
import React from "react";
import "./AboutUs.css";

function AboutUs() {
  return (
    <div className="about-page">
      <div className="about-content">
        <section className="mission-section">
          <h2 >About This Application</h2>
          <p>
          Welcome to the Room Booking Platform for Running Rooms, developed by East Coast Railway, Waltair Division. This platform is designed to offer a seamless and efficient lodging experience for crew members and officials. It streamlines the booking process while catering to their specific needs.

Equipped with advanced functionalities, the system enables real-time monitoring of bed availability and minimizes waiting times, ensuring timely rest for the crew. Transitioning from manual calculations, the software now proficiently automates key metrics, including crew counts by HQ, running room rest durations, meal consumption, bedsheet and blanket utilization, and peak occupancy analysis for any specified period.
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
              <h3>XXX</h3>
              <p>DRM</p>
            </div>
            <div className="team-member">
              <img
                src="https://via.placeholder.com/150"
                alt="Team Member"
                className="team-photo"
              />
              <h3>Manoj Kumar Sahoo</h3>
              <p>ADRM(OP)</p>
            </div>
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
              <h3>Sanchay    Adari</h3>
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
