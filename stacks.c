#include <stdio.h>
#include <stdlib.h>

#define SIZE 5

int stack[SIZE];
int top = -1;
void push(int val)
{
    if (top == SIZE - 1)
    {
        printf("Stack full! Cannot push %d\n", val);
    }
    else
    {
        top++;
        stack[top] = val;
        printf("Pushed: %d\n", val);
    }
}
int pop()
{
    if (top == -1)
    {
        printf("Stack empty! Cannot pop\n");
        return -1;
    }
    else
    {
        int val = stack[top];
        top--;
        return val;
    }
}
void peek()
{
    if (top == -1)
    {
        printf("Stack empty! \n");
    }
    else
    {
        printf("Top element: %d\n", stack[top]);
    }
}
void display()
{
    if (top == -1)
    {
        printf("Stack is empty\n");
    }
    else
    {
        printf("Stack contents (top to bottom): ");
        for (int i = top; i >= 0; i--)
        {
            printf("%d ", stack[i]);
        }
        printf("\n");
    }
}

int main()
{
    int choice, val;
    while (1)
    {
        printf("\nMenu Options:\n");
        printf("1. Push element\n");
        printf("2. Pop element\n");
        printf("3. Peek at top\n");
        printf("4. Display stack\n");
        printf("5. Exit\n");
        printf("Enter your choice (1-5): ");
        scanf("%d", &choice);
        switch (choice)
        {
        case 1:
            if (top == SIZE - 1)
            {
                printf("Stack is full! Maximum size: %d\n", SIZE);
            }
            else
            {
                printf("Enter val to push: ");
                scanf("%d", &val);
                push(val);
            }
            break;

        case 2:
            val = pop();
            if (val != -1)
            {
                printf("Popped: %d\n", val);
            }
            break;

        case 3:
            peek();
            break;

        case 4:
            display();
            break;

        case 5:
            printf("Exiting program. Goodbye!\n");
            return 0;

        default:
            printf("Invalid choice! Please enter 1-5\n");
            break;
        }
    }
    return 0;
}
