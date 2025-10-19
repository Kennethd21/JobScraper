#include <stdio.h>
#include <stdlib.h>

struct Node
{
    int data;
    struct Node *next;
};

struct Node *head = NULL;

void insertBeginning(int x)
{
    struct Node *newNode = (struct Node *)malloc(sizeof(struct Node));
    newNode->data = x;
    newNode->next = head;
    head = newNode;
    printf("Inserted at beginning: %d\n", x);
}

void insertEnd(int x)
{
    struct Node *newNode = (struct Node *)malloc(sizeof(struct Node));
    newNode->data = x;
    newNode->next = NULL;

    if (head == NULL)
    {
        head = newNode;
        printf("Inserted at end: %d\n", x);
        return;
    }

    struct Node *temp = head;
    while (temp->next != NULL)
    {
        temp = temp->next;
    }
    temp->next = newNode;
    printf("Inserted at end: %d\n", x);
}

void insertPosition(int x, int pos)
{
    struct Node *newNode = (struct Node *)malloc(sizeof(struct Node));
    newNode->data = x;

    if (pos == 1)
    {
        newNode->next = head;
        head = newNode;
        printf("Inserted at position %d: %d\n", pos, x);
        return;
    }

    struct Node *temp = head;
    for (int i = 1; i < pos - 1 && temp != NULL; i++)
    {
        temp = temp->next;
    }

    if (temp == NULL)
    {
        printf("Invalid position!\n");
        free(newNode);
        return;
    }

    newNode->next = temp->next;
    temp->next = newNode;
    printf("Inserted at position %d: %d\n", pos, x);
}

void deleteBeginning()
{
    if (head == NULL)
    {
        printf("List is empty!\n");
        return;
    }
    struct Node *temp = head;
    printf("Deleted: %d\n", temp->data);
    head = head->next;
    free(temp);
}

void deleteEnd()
{
    if (head == NULL)
    {
        printf("List is empty!\n");
        return;
    }

    if (head->next == NULL)
    {
        printf("Deleted: %d\n", head->data);
        free(head);
        head = NULL;
        return;
    }

    struct Node *temp = head;
    while (temp->next->next != NULL)
    {
        temp = temp->next;
    }
    printf("Deleted: %d\n", temp->next->data);
    free(temp->next);
    temp->next = NULL;
}

void deletePosition(int pos)
{
    if (head == NULL)
    {
        printf("List is empty!\n");
        return;
    }

    if (pos == 1)
    {
        struct Node *temp = head;
        printf("Deleted: %d\n", temp->data);
        head = head->next;
        free(temp);
        return;
    }

    struct Node *temp = head;
    for (int i = 1; i < pos - 1 && temp != NULL; i++)
    {
        temp = temp->next;
    }

    if (temp == NULL || temp->next == NULL)
    {
        printf("Invalid position!\n");
        return;
    }

    struct Node *delNode = temp->next;
    printf("Deleted: %d\n", delNode->data);
    temp->next = delNode->next;
    free(delNode);
}

void display()
{
    if (head == NULL)
    {
        printf("List is empty!\n");
        return;
    }
    printf("List: ");
    struct Node *temp = head;
    while (temp != NULL)
    {
        printf("%d -> ", temp->data);
        temp = temp->next;
    }
    printf("NULL\n");
}

void search(int x)
{
    struct Node *temp = head;
    int pos = 1;
    while (temp != NULL)
    {
        if (temp->data == x)
        {
            printf("Element %d found at position %d\n", x, pos);
            return;
        }
        temp = temp->next;
        pos++;
    }
    printf("Element %d not found!\n", x);
}

int main()
{
    int choice, x, pos;

    while (1)
    {
        printf("\n--- Linked List Menu ---\n");
        printf("1. Insert at Beginning\n");
        printf("2. Insert at End\n");
        printf("3. Insert at Position\n");
        printf("4. Delete from Beginning\n");
        printf("5. Delete from End\n");
        printf("6. Delete from Position\n");
        printf("7. Display\n");
        printf("8. Search\n");
        printf("9. Exit\n");
        printf("Enter choice: ");
        scanf("%d", &choice);

        switch (choice)
        {
        case 1:
            printf("Enter element: ");
            scanf("%d", &x);
            insertBeginning(x);
            break;
        case 2:
            printf("Enter element: ");
            scanf("%d", &x);
            insertEnd(x);
            break;
        case 3:
            printf("Enter element: ");
            scanf("%d", &x);
            printf("Enter position: ");
            scanf("%d", &pos);
            insertPosition(x, pos);
            break;
        case 4:
            deleteBeginning();
            break;
        case 5:
            deleteEnd();
            break;
        case 6:
            printf("Enter position: ");
            scanf("%d", &pos);
            deletePosition(pos);
            break;
        case 7:
            display();
            break;
        case 8:
            printf("Enter element to search: ");
            scanf("%d", &x);
            search(x);
            break;
        case 9:
            exit(0);
        default:
            printf("Invalid choice!\n");
        }
    }
    return 0;
}