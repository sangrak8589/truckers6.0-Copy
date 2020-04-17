import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
  path: string;
}

@Component({
  selector: 'app-admin-dash',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  router: Router;

  constructor() { }

  ngOnInit() {
  }

  tiles: Tile[] = [
    { text: "View Users", cols: 3, rows: 1, color: "lightblue", path: "/user-list"},
    { text: "View Companies", cols: 1, rows: 2, color: "lightgreen", path: "/company-list" },
    { text: "", cols: 1, rows: 1, color: "lightpink", path: ""},
    { text: "", cols: 2, rows: 1, color: "#DDBDF1", path: "" }
  ];

  onClick(tile: Tile)
  {
    this.router.navigate([tile.path]);
  }

}
