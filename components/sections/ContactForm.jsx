export const meta = { name: "Contact form", slug: "base-contact", category: "Base • Contact", sequence: 90, description: "A name / email / message form alongside your contact details." };

export default function ContactForm({
  heading = "Get in touch",
  text = "Send a message and we will reply shortly.",
  action = "",
  email = "hello@example.com",
  phone = "+1 (555) 010-0000",
  address = "123 Example Street, Your City",
} = {}) {
  return (
    <section className="section alt">
      <div className="container contact-grid">
        <div className="contact-intro">
          <h2 className="h2">{heading}</h2>
          <p className="lead">{text}</p>
          <ul className="contact-list">
            <li><span className="contact-label">Email</span><a href={"mailto:" + email}>{email}</a></li>
            <li><span className="contact-label">Phone</span><a href={"tel:" + phone.replace(/[^+\d]/g, "")}>{phone}</a></li>
            <li><span className="contact-label">Address</span><span>{address}</span></li>
          </ul>
        </div>
        <form className="card contact-form" method="post" action={action || undefined}>
          <div className="field"><label htmlFor="cf-name">Name</label><input id="cf-name" name="name" type="text" required /></div>
          <div className="field"><label htmlFor="cf-email">Email</label><input id="cf-email" name="email" type="email" required /></div>
          <div className="field"><label htmlFor="cf-message">Message</label><textarea id="cf-message" name="message" required></textarea></div>
          <button className="btn btn-primary btn-block" type="submit">Send message</button>
        </form>
      </div>
    </section>
  );
}
