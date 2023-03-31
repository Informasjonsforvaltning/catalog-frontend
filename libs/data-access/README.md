# Data-access Libraries

## What is it?

Data-access libraries contain code that function as client-side delegate layers to server tier APIs.

All files related to state management also reside in a data-access folder (by convention, they can be grouped under a +state folder under src/lib).

## Naming Convention

data-access (if nested) or data-access-\* (e.g. data-access-seatmap)

## Dependency Constraints

A data-access library can depend on data-access and util libraries.

## Running unit tests

Run `nx test data-access` to execute the unit tests via [Jest](https://jestjs.io).
