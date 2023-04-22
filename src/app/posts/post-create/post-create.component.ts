import { Component } from "@angular/core";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
})
export class PostCreateComponent {
  newPost = 'NO CONTENT';

  onAddPost(postInput: HTMLTextAreaElement) {
    // alert('Add Post');
    console.dir(postInput);
    // this.newPost = "The user\'s post";
    this.newPost = postInput.value;
  }
}
