import { StyleSheet } from "react-native";
import { UI_CONFIG } from "@/constants/config";

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_CONFIG.colors.background,
  },
  surface: {
    backgroundColor: UI_CONFIG.colors.surface,
    borderRadius: UI_CONFIG.borderRadius.md,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  spaceBetween: {
    justifyContent: "space-between",
  },
  padding: {
    padding: UI_CONFIG.spacing.md,
  },
  marginBottom: {
    marginBottom: UI_CONFIG.spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: UI_CONFIG.colors.text,
    marginBottom: UI_CONFIG.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: UI_CONFIG.colors.text,
    marginBottom: UI_CONFIG.spacing.sm,
  },
  body: {
    fontSize: 14,
    color: UI_CONFIG.colors.textSecondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    color: UI_CONFIG.colors.textSecondary,
  },
});

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: UI_CONFIG.colors.primary,
    paddingVertical: UI_CONFIG.spacing.sm + 4,
    paddingHorizontal: UI_CONFIG.spacing.lg,
    borderRadius: UI_CONFIG.borderRadius.sm,
    alignItems: "center",
  },
  primaryText: {
    color: UI_CONFIG.colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  secondary: {
    backgroundColor: "transparent",
    paddingVertical: UI_CONFIG.spacing.sm + 4,
    paddingHorizontal: UI_CONFIG.spacing.lg,
    borderRadius: UI_CONFIG.borderRadius.sm,
    borderWidth: 1,
    borderColor: UI_CONFIG.colors.primary,
    alignItems: "center",
  },
  secondaryText: {
    color: UI_CONFIG.colors.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  success: {
    backgroundColor: UI_CONFIG.colors.success,
    paddingVertical: UI_CONFIG.spacing.sm + 4,
    paddingHorizontal: UI_CONFIG.spacing.lg,
    borderRadius: UI_CONFIG.borderRadius.sm,
    alignItems: "center",
  },
  successText: {
    color: UI_CONFIG.colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  danger: {
    backgroundColor: UI_CONFIG.colors.error,
    paddingVertical: UI_CONFIG.spacing.sm + 4,
    paddingHorizontal: UI_CONFIG.spacing.lg,
    borderRadius: UI_CONFIG.borderRadius.sm,
    alignItems: "center",
  },
  dangerText: {
    color: UI_CONFIG.colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
});

export const errorStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFF3CD",
    marginHorizontal: UI_CONFIG.spacing.md,
    marginVertical: UI_CONFIG.spacing.sm,
    padding: UI_CONFIG.spacing.sm + 4,
    borderRadius: UI_CONFIG.borderRadius.sm,
    borderLeftWidth: 4,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    fontSize: 18,
    marginRight: UI_CONFIG.spacing.sm,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: "#856404",
    lineHeight: 20,
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: UI_CONFIG.spacing.sm,
  },
  closeText: {
    fontSize: 18,
    color: "#856404",
    fontWeight: "bold",
  },
});