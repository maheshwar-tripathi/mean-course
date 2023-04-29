import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, NG_ASYNC_VALIDATORS, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";


import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  public post: Post | undefined;
  form!: FormGroup;
  imagePreview!: string;
  private mode = "create";
  private postId!: string;
  isLoading = false;

  constructor(public postsService: PostsService, public route: ActivatedRoute, private router: Router) {}

  onSavePost() {
    if(this.form?.invalid) {
      return;
    }

    this.isLoading = true;

    if(this.mode === 'create') {
      this.postsService.addPost(this.form?.value.title, this.form?.value.content, this.form?.value.image);
    } else{
      this.postsService.updatePost(this.postId, this.form?.value.title, this.form?.value.content, this.form.value.image);
    }

    this.isLoading = false;
    this.form?.reset();
    this.router.navigate(['/']);
  }

  ngOnInit(): void {

    this.form = new FormGroup({
      'title':   new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'content': new FormControl(null, {validators: [Validators.required]}),
      'image':   new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode = "edit";
        this.postId = paramMap.get('postId')!;
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: ''
          };
          this.form.setValue({
            'title': this.post.title,
            'content': this.post.content,
            'image': this.post.imagePath
          });
        });

      } else {
        this.mode = "create";
        this.postId = null!;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.form.patchValue({image: file});
    this.form.get('image')!.updateValueAndValidity();
    const render = new FileReader();
    render.onload = () => {
      this.imagePreview = render.result as string;
    };
    render.readAsDataURL(file);
  }

}


