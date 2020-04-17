import { Component, OnInit } from '@angular/core';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
  path: string;
}

@Component({
  selector: 'app-driver-dash',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css']
})
export class DriverComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  tiles: Tile[] = [
    { text: "Point Status", cols: 1, rows: 1, color: "lightblue", path: "/user-company-list" },
    { text: "View My Companies", cols: 2, rows: 1, color: "lightgoldenrodyellow", path: "/user-company-list" }, 
    { text: "View Catalog", cols: 1, rows: 2, color: "lightgreen", path: "/catalog-list" },
    { text: "View Purchase Status", cols: 1, rows: 1, color: "lightpink", path: "" },
    { text: "Cancel/Update Purchase", cols: 2, rows: 1, color: "#DDBDF1", path: "" }
  ];

}
