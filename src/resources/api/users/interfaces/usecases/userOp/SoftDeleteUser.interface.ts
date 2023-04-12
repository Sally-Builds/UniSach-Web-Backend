export default interface SoftDeleteUserInterface {
    execute(id: string): Promise<void>
}