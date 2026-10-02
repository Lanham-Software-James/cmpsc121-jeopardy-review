import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <a class="skip-link" href="#main-content" (click)="skipToContent($event)">Skip to main content</a>
    <header class="masthead">
      <div class="page-width masthead-inner">
        <a class="campus-brand" href="https://behrend.psu.edu/" aria-label="Penn State Behrend website">
          <img class="campus-logo" src="PSU_EBO_RGB_2C.svg" alt="Penn State Behrend" width="349" height="115">
        </a>
        <a class="explore-link" href="https://behrend.psu.edu/">Explore Behrend <span aria-hidden="true">↗</span></a>
      </div>
    </header>
    <div class="course-bar"><div class="page-width course-inner">
      <a routerLink="/" class="course-title"><span class="code-mark" aria-hidden="true">&lt;/&gt;</span> CMPSC 121 <span class="course-divider">/</span> <span class="course-label">Exam Review</span></a>
      <nav aria-label="Exam reviews"><a routerLink="/reviews/midterm-1" routerLinkActive="active" ariaCurrentWhenActive="page">Midterm 1</a></nav>
    </div></div>
    <main id="main-content" class="page-width" tabindex="-1"><router-outlet /></main>
    <footer class="site-footer"><div class="page-width">
      <div class="footer-main">
        <div class="footer-campus"><strong>Penn State Behrend</strong>
          <p>Computer Science &amp; Software Engineering</p><p class="footer-location">Erie, Pennsylvania</p>
        </div>
        <nav class="footer-resources" aria-label="Campus resources">
          <a href="https://behrend.psu.edu/">Explore Behrend <span aria-hidden="true">↗</span></a>
          <a href="https://behrend.psu.edu/school-of-engineering/academic-programs/computer-science">More About Computer Science <span aria-hidden="true">↗</span></a>
          <a href="https://behrend.psu.edu/school-of-engineering/academic-programs/software-engineering">More About Software Engineering <span aria-hidden="true">↗</span></a>
          <a href="https://behrend.psu.edu/school-of-engineering/academic-programs/computer-science/faculty">Meet the Faculty <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
      <div class="footer-bottom"><p>© {{ year }} The Pennsylvania State University</p>
        <nav class="footer-policies" aria-label="University policies">
          <a href="https://www.psu.edu/accessibility">Accessibility</a>
          <a href="https://www.psu.edu/privacy">Privacy</a>
          <a href="https://policy.psu.edu/policies/ad85">Non-discrimination</a>
        </nav>
      </div>
    </div></footer>
  `
})
export class AppComponent {
  readonly year = new Date().getFullYear();
  skipToContent(event: Event): void {
    event.preventDefault();
    document.getElementById('main-content')?.focus();
  }
}
