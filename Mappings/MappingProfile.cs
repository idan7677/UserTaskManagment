using AutoMapper;
using UserTaskManagment.Models.Domain;
using UserTaskManagment.Models.DTOs;

namespace UserTaskManagment.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // UserTask mappings
        CreateMap<CreateUserTaskDto, UserTask>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UserTaskTags, opt => opt.Ignore());

        CreateMap<UpdateUserTaskDto, UserTask>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UserTaskTags, opt => opt.Ignore());

        CreateMap<UserTask, UserTaskResponseDto>()
            .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.UserTaskTags.Select(ut => ut.Tag)));

        // Tag mappings
        CreateMap<CreateTagDto, Tag>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Description, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UserTaskTags, opt => opt.Ignore());

        CreateMap<UpdateTagDto, Tag>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Description, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UserTaskTags, opt => opt.Ignore());

        CreateMap<Tag, TagDto>();
    }
}