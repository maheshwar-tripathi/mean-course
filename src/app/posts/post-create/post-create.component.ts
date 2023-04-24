import { Component, OnInit } from "@angular/core";
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";


import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  public post: Post | undefined;
  private mode = "create";
  private postId!: string;
  isLoading = false;

  constructor(public postsService: PostsService, public route: ActivatedRoute, private router: Router) {}

  onSavePost(form: NgForm) {
    if(form.invalid) {
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
    } else{
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
    }
    this.isLoading = false;
    form.resetForm();
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode = "edit";
        this.postId = paramMap.get('postId')!;
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content};
        });

      } else {
        this.mode = "create";
        this.postId = null!;
      }
    });
  }

}
