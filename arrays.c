#include <stdio.h>

#define MAX_SIZE 100

int arr[MAX_SIZE];
int size = 0;

void display()
{
    if (size == 0)
    {
        printf("Array is empty!\n");
        return;
    }
    printf("Array: ");
    for (int i = 0; i < size; i++)
    {
        printf("%d ", arr[i]);
    }
    printf("(Size: %d)\n", size);
}

void insert()
{
    if (size >= MAX_SIZE)
    {
        printf("Array is full!\n");
        return;
    }
    int value;
    printf("Enter value to insert at end: ");
    scanf("%d", &value);
    arr[size] = value;
    size++;
    printf("Inserted %d at end\n", value);
}

void insertAtPos()
{
    if (size >= MAX_SIZE)
    {
        printf("Array is full!\n");
        return;
    }
    int pos, value;
    printf("Enter position (0 to %d): ", size);
    scanf("%d", &pos);

    if (pos < 0 || pos > size)
    {
        printf("Invalid position!\n");
        return;
    }

    printf("Enter value to insert: ");
    scanf("%d", &value);

    for (int i = size; i > pos; i--)
    {
        arr[i] = arr[i - 1];
    }
    arr[pos] = value;
    size++;
    printf("Inserted %d at position %d\n", value, pos);
}

void deleteFromPos()
{
    if (size == 0)
    {
        printf("Array is empty!\n");
        return;
    }
    int pos;
    printf("Enter position to delete (0 to %d): ", size - 1);
    scanf("%d", &pos);

    if (pos < 0 || pos >= size)
    {
        printf("Invalid position!\n");
        return;
    }

    int deleted = arr[pos];
    for (int i = pos; i < size - 1; i++)
    {
        arr[i] = arr[i + 1];
    }
    size--;
    printf("Deleted %d from position %d\n", deleted, pos);
}

void search()
{
    if (size == 0)
    {
        printf("Array is empty!\n");
        return;
    }
    int value;
    printf("Enter value to search: ");
    scanf("%d", &value);

    for (int i = 0; i < size; i++)
    {
        if (arr[i] == value)
        {
            printf("Value %d found at position %d\n", value, i);
            return;
        }
    }
    printf("Value %d not found!\n", value);
}

void menu()
{
    printf("\n=== Array Operations ===\n");
    printf("1. Insert at end\n");
    printf("2. Insert at position\n");
    printf("3. Delete from position\n");
    printf("4. Search\n");
    printf("5. Display\n");
    printf("6. Exit\n");
    printf("Enter choice: ");
}

int main()
{
    int choice;

    while (1)
    {
        menu();
        scanf("%d", &choice);

        switch (choice)
        {
        case 1:
            insert();
            break;
        case 2:
            insertAtPos();
            break;
        case 3:
            deleteFromPos();
            break;
        case 4:
            search();
            break;
        case 5:
            display();
            break;
        case 6:
            printf("Exiting...\n");
            return 0;
        default:
            printf("Invalid choice!\n");
        }
    }

    return 0;
}