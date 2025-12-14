using Microsoft.AspNetCore.Mvc;
using UserTaskManagment.Models.DTOs;
using UserTaskManagment.Services.Interfaces;

namespace UserTaskManagment.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserTasksController : ControllerBase
{
    private readonly IUserTaskService _userTaskService;
    private readonly ILogger<UserTasksController> _logger;

    public UserTasksController(IUserTaskService userTaskService, ILogger<UserTasksController> logger)
    {
        _userTaskService = userTaskService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserTaskResponseDto>>> GetAll()
    {
        try
        {
            var tasks = await _userTaskService.GetAllAsync();
            return Ok(tasks);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all tasks");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserTaskResponseDto>> GetById(int id)
    {
        try
        {
            var task = await _userTaskService.GetByIdAsync(id);
            if (task == null)
                return NotFound($"Task with ID {id} not found");

            return Ok(task);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving task {TaskId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost]
    public async Task<ActionResult<UserTaskResponseDto>> Create([FromBody] CreateUserTaskDto createDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var task = await _userTaskService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating task");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<UserTaskResponseDto>> Update(int id, [FromBody] UpdateUserTaskDto updateDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var task = await _userTaskService.UpdateAsync(id, updateDto);
            if (task == null)
                return NotFound($"Task with ID {id} not found");

            return Ok(task);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating task {TaskId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            var result = await _userTaskService.DeleteAsync(id);
            if (!result)
                return NotFound($"Task with ID {id} not found");

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting task {TaskId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("with-multiple-tags")]
    public async Task<ActionResult<IEnumerable<UserTaskResponseDto>>> GetTasksWithAtLeastTwoTags()
    {
        try
        {
            var tasks = await _userTaskService.GetTasksWithAtLeastTwoTagsAsync();
            return Ok(tasks);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving tasks with multiple tags");
            return StatusCode(500, "Internal server error");
        }
    }
}