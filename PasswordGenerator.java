import java.security.SecureRandom;
import java.util.Scanner;

public class PasswordGenerator {

    // Character pools
    private static final String LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String DIGITS = "0123456789";
    private static final String SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>/?";

    public static String generatePassword(int length, boolean useLower, boolean useUpper,
                                          boolean useDigits, boolean useSymbols, boolean avoidAmbig) {

        StringBuilder charPool = new StringBuilder();
        if (useLower) charPool.append(LOWER);
        if (useUpper) charPool.append(UPPER);
        if (useDigits) charPool.append(DIGITS);
        if (useSymbols) charPool.append(SYMBOLS);

        if (charPool.length() == 0) {
            throw new IllegalArgumentException("At least one character set must be selected.");
        }

        // Remove ambiguous characters if needed
        String ambiguous = "Il1O0`'\".,;:|\\/";
        String availableChars = charPool.toString();
        if (avoidAmbig) {
            StringBuilder filtered = new StringBuilder();
            for (char c : availableChars.toCharArray()) {
                if (ambiguous.indexOf(c) == -1) {
                    filtered.append(c);
                }
            }
            availableChars = filtered.toString();
            if (availableChars.isEmpty()) {
                throw new IllegalArgumentException("Avoiding ambiguous characters removed all options.");
            }
        }

        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder();

        for (int i = 0; i < length; i++) {
            int index = random.nextInt(availableChars.length());
            password.append(availableChars.charAt(index));
        }

        return password.toString();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter password length: ");
        int length = sc.nextInt();

        // Default: all options ON
        boolean useLower = true, useUpper = true, useDigits = true, useSymbols = true;

        System.out.print("Avoid ambiguous characters (y/n)? ");
        boolean avoidAmbig = sc.next().trim().equalsIgnoreCase("y");

        String password = generatePassword(length, useLower, useUpper, useDigits, useSymbols, avoidAmbig);

        System.out.println("Generated password: " + password);
    }
}
