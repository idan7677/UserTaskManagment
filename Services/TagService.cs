using AutoMapper;
using UserTaskManagment.Data;
using UserTaskManagment.Models.Domain;
using UserTaskManagment.Models.DTOs;
using UserTaskManagment.Services.Interfaces;

namespace UserTaskManagment.Services;

public class TagService : ITagService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<TagService> _logger;

    public TagService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<TagService> logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<TagDto?> GetByIdAsync(int id)
    {
        var tag = await _unitOfWork.Tags.GetByIdAsync(id);
        return tag == null ? null : _mapper.Map<TagDto>(tag);
    }

    public async Task<IEnumerable<TagDto>> GetAllAsync()
    {
        var tags = await _unitOfWork.Tags.GetAllAsync();
        return _mapper.Map<IEnumerable<TagDto>>(tags);
    }

    public async Task<TagDto> CreateAsync(CreateTagDto createDto)
    {
        var existingTag = await _unitOfWork.Tags.GetByNameAsync(createDto.Name);
        if (existingTag != null)
            throw new InvalidOperationException($"Tag with name '{createDto.Name}' already exists");

        var tag = _mapper.Map<Tag>(createDto);
        tag.CreatedAt = DateTime.UtcNow;

        await _unitOfWork.Tags.AddAsync(tag);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<TagDto>(tag);
    }

    public async Task<TagDto?> UpdateAsync(int id, UpdateTagDto updateDto)
    {
        var existingTag = await _unitOfWork.Tags.GetByIdAsync(id);
        if (existingTag == null)
            return null;

        var tagWithSameName = await _unitOfWork.Tags.GetByNameAsync(updateDto.Name);
        if (tagWithSameName != null && tagWithSameName.Id != id)
            throw new InvalidOperationException($"Tag with name '{updateDto.Name}' already exists");

        _mapper.Map(updateDto, existingTag);
        await _unitOfWork.Tags.UpdateAsync(existingTag);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<TagDto>(existingTag);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var tag = await _unitOfWork.Tags.GetByIdAsync(id);
        if (tag == null)
            return false;

        await _unitOfWork.Tags.DeleteAsync(tag);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}