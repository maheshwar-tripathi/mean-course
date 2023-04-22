import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  enteredTitle = '';
  interedContent = '';
  @Output() postCreated = new EventEmitter();

  onAddPost() {
    console.log(this.enteredTitle);
    const post = {
      title: this.enteredTitle,
      content: this.interedContent
    };
    this.postCreated.emit(post);
  }
}
