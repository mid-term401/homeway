import React from "react";
import emailjs from "emailjs-com";

export default function ContactUs() {
  function sendEmail(e) {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_ubvgdz4",
        "template_i8prkaq",
        e.target,
        "user_dncOf0N71yVFqKUwhCpmT"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  }

  return (
    <>
      <h3>How can we help you</h3>
      <form className="contact-form" onSubmit={sendEmail}>
        <input type="hidden" name="contact_number" />

        <label>Your Name: </label>
        <input type="text" name="from_name" />

        <label>Your Email</label>
        <input type="email" name="sender_email" />

        <label>Topic: </label>
        <input type="text" name="subject" />

        <label>Message</label>
        <textarea name="message" />
        <input type="submit" value="Send" />
      </form>
    </>
  );
}
