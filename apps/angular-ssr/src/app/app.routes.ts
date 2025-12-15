import { Routes } from '@angular/router';
import { homeResolver } from './pages/home/home.resolver';
import { postsResolver } from './pages/posts/posts.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    resolve: { resolved: homeResolver },
  },
  {
    path: 'posts',
    loadComponent: () =>
      import('./pages/posts/posts.component').then((m) => m.PostsComponent),
    resolve: { resolved: postsResolver },
  },
  {
    path: 'posts/:id',
    loadComponent: () =>
      import('./pages/post-detail/post-detail.component').then(
        (m) => m.PostDetailComponent
      ),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/users/users.component').then((m) => m.UsersComponent),
  },
  {
    path: 'users/:id',
    loadComponent: () =>
      import('./pages/user-detail/user-detail.component').then(
        (m) => m.UserDetailComponent
      ),
  },
  {
    path: 'albums',
    loadComponent: () =>
      import('./pages/albums/albums.component').then((m) => m.AlbumsComponent),
  },
  {
    path: 'albums/:id',
    loadComponent: () =>
      import('./pages/album-detail/album-detail.component').then(
        (m) => m.AlbumDetailComponent
      ),
  },
  {
    path: 'photos',
    loadComponent: () =>
      import('./pages/photos/photos.component').then((m) => m.PhotosComponent),
  },
  {
    path: 'todos',
    loadComponent: () =>
      import('./pages/todos/todos.component').then((m) => m.TodosComponent),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];

