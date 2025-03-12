/// <reference types="vite/client" />

type Player = [string, string, number];
type Point = [number, number, number];
type TerritoryPoint = [number, number];
type Border = [TerritoryPoint, TerritoryPoint];
type Territories = number[][];