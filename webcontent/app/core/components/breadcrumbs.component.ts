import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Route, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

class Breadcrumb{
  url: string
  label: string
}

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styles: [`
      a.clickable:hover {cursor: pointer; text-decoration: underline;}
      `],
})
export class BreadcrumbsComponent implements OnInit, OnDestroy{

  breadcrumbs: Breadcrumb[] = [];
  lastBreadcrumb: Breadcrumb;

  // private properties
  private routerSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {};

  ngOnInit(): void {
    this.routerSubscription = 
      this.router.events.filter(event => event instanceof NavigationEnd)
        .subscribe(event => this.buildBreadcrumbs());
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  buildBreadcrumbs(): void {
    this.breadcrumbs = [];
    this.lastBreadcrumb = {url: '/home', label: 'Home'};
    let url = '';
    let lastLabel: string = 'Home';
    let route = this.activatedRoute.root;
    while (route && route.snapshot) {
      let snapshot = route.snapshot;
      if (snapshot.url.length >0) {
        let subUrl = snapshot.url.map(segment => segment.path).join('/');
        url += '/' + subUrl;

        let label: string = null;
        if (snapshot.data["breadcrumb"] && snapshot.data["breadcrumb"] !== lastLabel) {
          label = snapshot.data["breadcrumb"];
          lastLabel = label;
        } else {
          label = subUrl;
        }
        if (url != this.lastBreadcrumb.url) {
          this.breadcrumbs.push(this.lastBreadcrumb);
          this.lastBreadcrumb = {url: url, label: label};
        }
      }

      let children = route.children;
      route = null;
      children.forEach(child => {
        if (child.outlet === 'primary') {
          route = child;
        }
      });
    }
  }

  changeUrl(url:string) {
    this.activatedRoute.root.children.forEach(route => {
      if (route.outlet === 'primary') {
        let urlTree = this.router.createUrlTree([url], {relativeTo: route});
        console.log(urlTree);
        this.router.navigateByUrl(urlTree);
      }
    });
  }

}
    //<a (click)="changeUrl(breadcrumb.url) clickable">{{breadcrumb.label}}</a>
    //<a [routerLink]="[breadcrumb.url]">{{breadcrumb.label}}</a>
