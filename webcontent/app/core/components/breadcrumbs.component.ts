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
  lastBreadcrumb: Breadcrumb

  // private properties
  private routerSubscription: Subscription;
  private bottomRoute: ActivatedRoute;

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
    this.lastBreadcrumb = {label: 'Home', url: ''};
    let route = this.activatedRoute.root;
    this.bottomRoute = route;
    while (route && route.snapshot) {
      let children = route.children;
      route = null;
      children.forEach(child => {
        if (child.outlet === 'primary') {
          this.insertBreadcrumb(child);
          route = child;
          this.bottomRoute = route;
        }
      });
    }
  }

  insertBreadcrumb(route: ActivatedRoute): void {
    let snapshot = route.snapshot;
    snapshot.url.forEach( segment => {
      let label = snapshot.data["breadcrumb"] ? snapshot.data["breadcrumb"]
          : segment.path;
      if (label !== this.lastBreadcrumb.label) {
        this.breadcrumbs.push(this.lastBreadcrumb);
      }
      this.breadcrumbs.forEach(bc => bc.url = '../' + bc.url);
      this.lastBreadcrumb = {label: label, url: ''};
    });
  }

  navigateTo(url:string) {
    this.router.navigate([url], {relativeTo: this.bottomRoute});
  }

}
