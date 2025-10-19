import random

# ANSI color codes for terminal output
GREEN = '\033[1;42m'   # Bright Green background
YELLOW = '\033[1;43m'  # Bright Yellow background
GRAY = '\033[1;40m'    # Black background (gray substitute)
RESET = '\033[0m'      # Reset to default

def load_words(filename):
    """
    Load five-letter words from a file into a set and list.
    Returns (word_list, word_set).
    """
    with open('words.txt', 'r') as f:
        words = [line.strip().lower() for line in f if len(line.strip()) == 5 and line.strip().isalpha()]
    return words, set(words)

def choose_secret_word(word_list):
    """
    Randomly select a secret word from the word list.
    """
    return random.choice(word_list)

def get_valid_guess(word_set):
    """
    Prompt the user for a valid guess:
    - Exactly 5 letters
    - Alphabetic only
    - In the word list
    Case-insensitive input.
    """
    while True:
        guess = input("Enter your guess (5-letter word): ").strip().lower()
        if len(guess) != 5:
            print("Invalid input: Guess must be exactly 5 letters.")
            continue
        if not guess.isalpha():
            print("Invalid input: Guess must contain only letters.")
            continue
        if guess not in word_set:
            print("Invalid input: Word not in word list.")
            continue
        return guess

def check_guess(guess, secret):
    """
    Compare guess to secret word and return a list of feedback for each letter:
    'correct' - letter and position match (green)
    'present' - letter in word but wrong position (yellow)
    'absent'  - letter not in word (gray)
    
    Handles duplicate letters correctly.
    """
    feedback = ['absent'] * 5
    secret_chars = list(secret)
    guess_chars = list(guess)

    # First pass: check correct letters in correct positions
    for i in range(5):
        if guess_chars[i] == secret_chars[i]:
            feedback[i] = 'correct'
            secret_chars[i] = None  # Remove matched letter

    # Second pass: check letters present elsewhere
    for i in range(5):
        if feedback[i] == 'correct':
            continue
        if guess_chars[i] in secret_chars:
            feedback[i] = 'present'
            # Remove the first occurrence of this letter to avoid double counting
            ind = secret_chars.index(guess_chars[i])
            secret_chars[ind] = None

    return feedback

def display_feedback(guess, feedback):
    """
    Display the guess with colored feedback:
    Green for correct, Yellow for present, Gray for absent.
    """
    colored_output = []
    for i in range(5):
        letter = guess[i].upper()
        if feedback[i] == 'correct':
            colored_output.append(f"{GREEN}{letter}{RESET}")
        elif feedback[i] == 'present':
            colored_output.append(f"{YELLOW}{letter}{RESET}")
        else:
            colored_output.append(f"{GRAY}{letter}{RESET}")
    print(" ".join(colored_output))

def play_wordle():
    """
    Main game loop for Wordle.
    """
    word_list, word_set = load_words('words.txt')
    secret_word = choose_secret_word(word_list)
    attempts = 6

    print("Welcome to Command-Line Wordle!")
    print("Guess the secret 5-letter word in 6 attempts.")
    print("Feedback: Green=correct, Yellow=present, Gray=absent.\n")

    for attempt in range(1, attempts + 1):
        print(f"Attempt {attempt} of {attempts}")
        guess = get_valid_guess(word_set)
        feedback = check_guess(guess, secret_word)
        display_feedback(guess, feedback)

        if guess == secret_word:
            print(f"Congratulations! You guessed the word '{secret_word.upper()}' correctly in {attempt} attempts.")
            break
    else:
        print(f"Sorry, you've used all attempts. The secret word was '{secret_word.upper()}'.")

if __name__ == "__main__":
    play_wordle()