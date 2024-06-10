export enum Roles {
    Owner,
    Administrator,
    User,
    Billing
}

export const RoleDescriptions: { [key in Roles]: string } = {
    [Roles.Owner]: 'Can\'t be removed from administrators.',
    [Roles.Administrator]: 'Can add and remove users, change roles and cancel or resume the subscription.',
    [Roles.User]: 'Can use the product. Uses a seat.',
    [Roles.Billing]: 'Can see invoices and change payment methods.'
};