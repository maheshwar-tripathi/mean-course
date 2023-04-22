import { Component } from "@angular/core";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
})
export class PostCreateComponent {
  newPost = 'NO CONTENT';
  interedValue = '';

  onAddPost() {
    this.newPost = this.interedValue;
  }
}
