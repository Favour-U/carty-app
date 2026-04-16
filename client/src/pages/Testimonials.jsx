// testimonials page - dedicated page for reviews, linked from the footer
import Footer from '../components/Footer';
import '../styles/Testimonials.css';

// fake review data - in a real app this would come from the backend
const REVIEWS = [
  {
    id: 1,
    name: 'Martha Collins',
    text: "Lorem ipsum dolor sit amet consectetur. Ac volutpat nisl ut leo. Et interdum nisi consequat eu pellentesque sed pharetra morbi. Sed lectus ullamcorper urna in egestas. Lorem ipsum dolor sit amet consectetur. Leo mauris fringilla condimentum et suspendisse nisl lacus non.",
    stars: 5,
    initials: 'MC',
    color: '#F97316',
  },
  {
    id: 2,
    name: 'Marissa Chris',
    text: "Lorem ipsum dolor sit amet consectetur. Ac volutpat nisl ut leo. Et interdum nisi consequat eu pellentesque sed pharetra morbi. Sed lectus ullamcorper urna in egestas. Lorem ipsum dolor sit amet consectetur. Leo mauris fringilla condimentum et suspendisse nisl lacus non.",
    stars: 5,
    initials: 'MC',
    color: '#EC4899',
  },
  {
    id: 3,
    name: 'Jennifer Quest',
    text: "Lorem ipsum dolor sit amet consectetur. Ac volutpat nisl ut leo. Et interdum nisi consequat eu pellentesque sed pharetra morbi. Sed lectus ullamcorper urna in egestas. Lorem ipsum dolor sit amet consectetur. Leo mauris fringilla condimentum et suspendisse nisl lacus non.",
    stars: 5,
    initials: 'JQ',
    color: '#DB2777',
  },
];

export default function Testimonials() {
  return (
    <div className="testimonials-page">

      {/* hero section with food background and title */}
      <section className="testimonials-hero">
        <h1 className="testimonials-hero__title">Testimonials</h1>
      </section>

      {/* review cards - staggered layout alternating left/right */}
      <section className="testimonials-section">
        <div className="container testimonials-cards">
          {REVIEWS.map((review, i) => (
            <div
              key={review.id}
              className={`testimonial-card ${i % 2 === 1 ? 'testimonial-card--right' : ''}`}
            >
              {/* avatar is on the right for odd cards, left for even */}
              {i % 2 === 1 && (
                <div className="testimonial-card__avatar" style={{ background: review.color }}>
                  {review.initials}
                </div>
              )}

              <div className="testimonial-card__body">
                <h3 className="testimonial-card__name">{review.name}</h3>
                <p className="testimonial-card__text">{review.text}</p>
                <p className="testimonial-card__read-more">Read More</p>
                <div className="testimonial-card__stars">
                  {'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}
                </div>
              </div>

              {/* avatar on the right for default (even) cards */}
              {i % 2 === 0 && (
                <div className="testimonial-card__avatar" style={{ background: review.color }}>
                  {review.initials}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* decorative orange circles on the sides */}
        <div className="section-circle section-circle--left" />
        <div className="section-circle section-circle--right" />
      </section>

      <Footer />
    </div>
  );
}
