import { TitleCasePipe } from '@angular/common';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="p-4 bg-sky-600">
      <div>
        <span class="text-base font-semibold text-black">
          {{ title | titlecase }}
        </span>
      </div>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
})
export class AppComponent {
  title = 'image-optimization';
}
