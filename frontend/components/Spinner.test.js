// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import { render, screen } from "@testing-library/react"
import Spinner from "./Spinner"
import React from "react"
import '@testing-library/jest-dom/extend-expect';

test('sanity', () => {
  expect(true).toBe(true)
})

test ('spinner shows when on', () => {
  render(<Spinner on={true}/>);
  const spinner = screen.queryByText(/Please wait.../i);
  expect(spinner).toBeInTheDocument();
})

test ('spinner absent when prop is off', () => {
  render(<Spinner on={false}/>);
  const spinner = screen.queryByText(/Please wait.../i);
  expect(spinner).toBe(null);
})
