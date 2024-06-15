export enum Role {
    Owner = 'Owner',
    Administrator = 'Administrator',
    User = 'User',
    Billing = 'Billing'
}

export const RoleDescriptions: { [key in Role]: string } = {
    [Role.Owner]: 'Can\'t be removed from administrators.',
    [Role.Administrator]: 'Can add and remove users, change roles and cancel or resume the subscription.',
    [Role.User]: 'Can use the product. Uses a user.',
    [Role.Billing]: 'Can see invoices and change payment methods.'
};