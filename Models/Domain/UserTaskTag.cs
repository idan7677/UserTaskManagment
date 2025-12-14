namespace UserTaskManagment.Models.Domain;

public class UserTaskTag
{
    public int UserTaskId { get; set; }
    public int TagId { get; set; }
    
    public virtual UserTask UserTask { get; set; } = null!;
    public virtual Tag Tag { get; set; } = null!;
}