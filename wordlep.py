import random

def load_words(words.txt):
    """
    Loads all valid five-letter words from a txt file.
    Cleans words, converts to lowercase, and stores in a set for fast lookups.
    """
    words = set()
    with open(filename, 'r') as f:
        for line in f:
            word = line.strip().lower()
            if len(word) == 5 and word.isalpha():
                words.add(word)
    return words

def choose_secret(words):
    """
    Randomly selects a secret word from the set of valid words.
    """
    return random.choice(list(words))

def validate_guess(guess, words):
    """
    Validates that guess is a five-letter word and present in the set.
    """
    guess = guess.lower()
    return len(guess) == 5 and guess.isalpha() and guess in words

def get_feedback(guess, secret):
    """
    Returns feedback as a list with:
      'G' (green) for correct letter & position,
      'Y' (yellow) for correct letter, wrong position,
      'B' (black/gray) for absent letter.
    Uses letter counts to avoid double-counting for yellows.
    """
    feedback = ['B'] * 5
    secret_letters = list(secret)
    # First pass for greens
    for i in range(5):
        if guess[i] == secret[i]:
            feedback[i] = 'G'
            secret_letters[i] = None  # 'Use up' matched letter
    # Second pass for yellows
    for i in range(5):
        if feedback[i] == 'B' and guess[i] in secret_letters:
            feedback[i] = 'Y'
            secret_letters[secret_letters.index(guess[i])] = None
    return feedback

def display_feedback(guess, feedback):
    """
    Displays guess letters with colors using emoji squares.
    Green: 🟩, Yellow: 🟨, Gray: ⬛
    """
    colors = {'G': '🟩', 'Y': '🟨', 'B': '⬛'}
    print(' '.join([f"{c}{g.upper()}{c}" for g, c in zip(guess, [colors[x] for x in feedback])]))

def play_wordle(words):
    """
    Main game loop for Wordle.
    """
    secret = choose_secret(words)
    MAX_TRIES = 6
    print("Welcome to Wordle! Guess the secret 5-letter word.")
    # Uncomment for development/debugging:
    # print(f"(Debug) Secret word: {secret}")

    for attempt in range(1, MAX_TRIES + 1):
        while True:
            guess = input(f"Attempt {attempt}/{MAX_TRIES}: ").strip().lower()
            if validate_guess(guess, words):
                break
            print("Invalid guess. Must be a valid 5-letter word from the list.")
        feedback = get_feedback(guess, secret)
        display_feedback(guess, feedback)
        if guess == secret:
            print(f"Congratulations! You guessed the word '{secret}' in {attempt} tries.")
            return
    print(f"Sorry, the secret word was '{secret}'. Better luck next time!")

if __name__ == "__main__":
    words = load_words("words.txt")  # Change this to path of your 5-letter-word text file
    play_wordle(words)
