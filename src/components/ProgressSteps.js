// ProgressSteps.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export const ProgressSteps = ({ children, activeStep }) => {
  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        {React.Children.map(children, (child, index) => (
          <View key={index} style={styles.stepContainer}>
            <View
              style={[
                styles.stepIndicator,
                index <= activeStep && styles.activeStep,
              ]}
            >
              <Text style={styles.stepNumber}>{index + 1}</Text>
            </View>
            <Text
              style={[
                styles.stepLabel,
                index <= activeStep && styles.activeStepLabel,
              ]}
            >
              {child.props.label}
            </Text>
          </View>
        ))}
      </View>
      {React.Children.toArray(children)[activeStep]}
    </View>
  );
};

export const ProgressStep = ({
  children,
  onNext,
  onPrevious,
  label,
  isLastStep,
  isFirstStep,
}) => {
  return (
    <View style={styles.stepPageContainer}>
      <View style={styles.contentContainer}>{children}</View>
      <View style={styles.buttonContainer}>
        {!isFirstStep && (
          <TouchableOpacity style={styles.button} onPress={onPrevious}>
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
        )}
        {!isLastStep && (
          <TouchableOpacity style={styles.button} onPress={onNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  stepContainer: {
    alignItems: "center",
  },
  stepIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  activeStep: {
    backgroundColor: "#007BFF",
  },
  stepNumber: {
    color: "#fff",
  },
  stepLabel: {
    marginTop: 5,
    fontSize: 12,
    color: "#ccc",
  },
  activeStepLabel: {
    color: "#007BFF",
  },
  stepPageContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
