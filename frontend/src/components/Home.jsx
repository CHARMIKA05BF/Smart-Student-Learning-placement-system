const Home = () => {
  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Learning & Placement</p>
          <h1>Smart student training management for every role</h1>
          <p className="hero-copy">
            Track courses, submit assignments, and apply for placements in one responsive platform.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#courses">Explore courses</a>
            <a className="button secondary" href="#jobs">View jobs</a>
          </div>
        </div>
      </section>

      <section className="feature-grid" id="courses">
        <article>
          <h2>Course management</h2>
          <p>Create, enroll, and review progress with easy course controls.</p>
        </article>
        <article>
          <h2>Assignments</h2>
          <p>Submit work, get feedback, and view grades in a central dashboard.</p>
        </article>
        <article>
          <h2>Job portal</h2>
          <p>Post jobs, apply quickly, and keep track of placement updates.</p>
        </article>
      </section>
    </main>
  )
}

export default Home
