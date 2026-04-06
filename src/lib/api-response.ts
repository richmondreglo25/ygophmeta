/**
 * API Response utilities
 * Standardized response formatting for API routes
 */

import { NextResponse } from "next/server";
import { HTTP_STATUS } from "./constants";

/**
 * Standard API response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Creates a successful API response
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = HTTP_STATUS.OK,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status },
  );
}

/**
 * Creates an error API response
 */
export function errorResponse(
  error: string,
  status: number = HTTP_STATUS.BAD_REQUEST,
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status },
  );
}

/**
 * Creates a validation error response
 */
export function validationError(
  message: string = "Validation failed",
): NextResponse<ApiResponse> {
  return errorResponse(message, HTTP_STATUS.BAD_REQUEST);
}

/**
 * Creates a not found error response
 */
export function notFoundError(
  message: string = "Resource not found",
): NextResponse<ApiResponse> {
  return errorResponse(message, HTTP_STATUS.NOT_FOUND);
}

/**
 * Creates an internal server error response
 */
export function internalError(
  message: string = "Internal server error",
): NextResponse<ApiResponse> {
  return errorResponse(message, HTTP_STATUS.INTERNAL_ERROR);
}
