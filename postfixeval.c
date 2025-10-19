#include <stdio.h>
#include <ctype.h>
#include <string.h>

int stack[100];
int top = -1;

void push(int x)
{
    stack[++top] = x;
}

int pop()
{
    return stack[top--];
}

int main()
{
    char postfix[100];
    int i = 0;

    printf("Enter postfix expression: ");
    scanf("%s", postfix);

    while (postfix[i])
    {
        if (isdigit(postfix[i]))
        {
            push(postfix[i] - '0');
        }
        else
        {
            int op2 = pop();
            int op1 = pop();
            int result;

            if (postfix[i] == '+')
                result = op1 + op2;
            else if (postfix[i] == '-')
                result = op1 - op2;
            else if (postfix[i] == '*')
                result = op1 * op2;
            else if (postfix[i] == '/')
                result = op1 / op2;

            push(result);
        }
        i++;
    }

    printf("Result: %d\n", pop());
    return 0;
}