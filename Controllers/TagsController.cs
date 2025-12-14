using Microsoft.AspNetCore.Mvc;
using UserTaskManagment.Models.DTOs;
using UserTaskManagment.Services.Interfaces;

namespace UserTaskManagment.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TagsController : ControllerBase
{
    private readonly ITagService _tagService;
    private readonly ILogger<TagsController> _logger;

    public TagsController(ITagService tagService, ILogger<TagsController> logger)
    {
        _tagService = tagService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TagDto>>> GetAll()
    {
        try
        {
            var tags = await _tagService.GetAllAsync();
            return Ok(tags);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all tags");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TagDto>> GetById(int id)
    {
        try
        {
            var tag = await _tagService.GetByIdAsync(id);
            if (tag == null)
                return NotFound($"Tag with ID {id} not found");

            return Ok(tag);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving tag {TagId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost]
    public async Task<ActionResult<TagDto>> Create([FromBody] CreateTagDto createDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var tag = await _tagService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = tag.Id }, tag);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating tag");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TagDto>> Update(int id, [FromBody] UpdateTagDto updateDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var tag = await _tagService.UpdateAsync(id, updateDto);
            if (tag == null)
                return NotFound($"Tag with ID {id} not found");

            return Ok(tag);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating tag {TagId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            var result = await _tagService.DeleteAsync(id);
            if (!result)
                return NotFound($"Tag with ID {id} not found");

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting tag {TagId}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}