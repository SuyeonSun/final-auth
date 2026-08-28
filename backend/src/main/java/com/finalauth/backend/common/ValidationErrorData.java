package com.finalauth.backend.common;

import java.util.List;
import java.util.Map;

public record ValidationErrorData(Map<String, List<String>> fieldErrors) {
}
